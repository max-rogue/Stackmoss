/**
 * Repo Map Scanner — generates structural overview of a repository
 * Authority: BRD §13, cli-pipeline skill
 *
 * Deterministic: no LLM, no external API calls.
 * Scans only directory tree + key config files (package.json, tsconfig, etc.)
 * Does NOT read all source files — only entry points and index files.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

// ─── Types ──────────────────────────────────────────────────────

export interface RepoMapResult {
    archType: 'monorepo' | 'single' | 'workspace';
    languages: LanguageStat[];
    entryPoints: string[];
    dirAnnotations: DirAnnotation[];
    configFiles: ConfigFile[];
    moduleDeps: ModuleDep[];
    patterns: string[];
}

export interface LanguageStat {
    name: string;
    extension: string;
    fileCount: number;
    percentage: number;
}

export interface DirAnnotation {
    path: string;
    purpose: string;
    fileCount: number;
    depth: number;
}

export interface ConfigFile {
    path: string;
    purpose: string;
}

export interface ModuleDep {
    from: string;
    to: string;
}

// ─── Constants ──────────────────────────────────────────────────

const SKIP_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', '.nuxt',
    '__pycache__', '.pytest_cache', 'venv', '.venv', 'env',
    'coverage', '.nyc_output', '.turbo', '.cache', '.output',
    '.stackmoss', '.DS_Store',
]);

const LANG_MAP: Record<string, string> = {
    '.ts': 'TypeScript', '.tsx': 'TypeScript',
    '.js': 'JavaScript', '.jsx': 'JavaScript', '.mjs': 'JavaScript', '.cjs': 'JavaScript',
    '.py': 'Python',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java', '.kt': 'Kotlin',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.cs': 'C#',
    '.cpp': 'C++', '.cc': 'C++', '.h': 'C/C++ Header',
    '.c': 'C',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.dart': 'Dart',
};

const DIR_PURPOSE_MAP: Record<string, string> = {
    'src': 'Source code',
    'lib': 'Shared libraries/utilities',
    'api': 'API endpoints',
    'routes': 'Route handlers',
    'controllers': 'Request controllers',
    'services': 'Business logic services',
    'models': 'Data models',
    'schemas': 'Schema definitions',
    'types': 'Type definitions',
    'interfaces': 'Interface definitions',
    'utils': 'Utility functions',
    'helpers': 'Helper functions',
    'middleware': 'Middleware layer',
    'config': 'Configuration',
    'constants': 'Constants/enums',
    'components': 'UI components',
    'pages': 'Page components',
    'views': 'View templates',
    'layouts': 'Layout components',
    'hooks': 'Custom hooks',
    'composables': 'Vue composables',
    'store': 'State management',
    'stores': 'State management',
    'redux': 'Redux state',
    'context': 'React context',
    'assets': 'Static assets',
    'public': 'Public static files',
    'static': 'Static files',
    'styles': 'Stylesheets',
    'css': 'CSS styles',
    'tests': 'Test files',
    'test': 'Test files',
    '__tests__': 'Test files',
    'spec': 'Test specifications',
    'e2e': 'End-to-end tests',
    'fixtures': 'Test fixtures',
    'mocks': 'Test mocks',
    'scripts': 'Build/dev scripts',
    'tools': 'Development tools',
    'docs': 'Documentation',
    'migrations': 'Database migrations',
    'prisma': 'Prisma schema & migrations',
    'db': 'Database layer',
    'database': 'Database layer',
    'seeds': 'Database seeds',
    'locales': 'Internationalization',
    'i18n': 'Internationalization',
    'plugins': 'Plugin modules',
    'modules': 'Feature modules',
    'features': 'Feature-based modules',
    'domain': 'Domain logic',
    'core': 'Core business logic',
    'shared': 'Shared/cross-cutting code',
    'common': 'Common utilities',
    'guards': 'Auth/route guards',
    'decorators': 'Decorators',
    'pipes': 'Validation pipes',
    'filters': 'Exception filters',
    'interceptors': 'Request interceptors',
    'dto': 'Data transfer objects',
    'entities': 'Database entities',
    'resolvers': 'GraphQL resolvers',
    'commands': 'CLI commands',
    'cli': 'CLI layer',
    'workers': 'Background workers',
    'jobs': 'Background jobs',
    'queues': 'Message queues',
    'events': 'Event handlers',
    'subscribers': 'Event subscribers',
    'apps': 'Monorepo applications',
    'packages': 'Monorepo packages',
    'libs': 'Monorepo libraries',
};

const CONFIG_FILES: Record<string, string> = {
    'package.json': 'Node.js project manifest',
    'tsconfig.json': 'TypeScript configuration',
    'tsconfig.base.json': 'TypeScript base config (monorepo)',
    '.env': 'Environment variables',
    '.env.example': 'Environment variable template',
    '.env.local': 'Local environment overrides',
    'prisma/schema.prisma': 'Prisma database schema',
    'docker-compose.yml': 'Docker Compose services',
    'docker-compose.yaml': 'Docker Compose services',
    'Dockerfile': 'Container build definition',
    '.dockerignore': 'Docker build ignore rules',
    'vercel.json': 'Vercel deployment config',
    'netlify.toml': 'Netlify deployment config',
    'fly.toml': 'Fly.io deployment config',
    'turbo.json': 'Turborepo task pipeline',
    'nx.json': 'Nx workspace config',
    'lerna.json': 'Lerna monorepo config',
    '.eslintrc.js': 'ESLint rules',
    '.eslintrc.json': 'ESLint rules',
    'eslint.config.js': 'ESLint flat config',
    '.prettierrc': 'Prettier formatting',
    'jest.config.ts': 'Jest test config',
    'jest.config.js': 'Jest test config',
    'vitest.config.ts': 'Vitest test config',
    'vite.config.ts': 'Vite bundler config',
    'next.config.js': 'Next.js config',
    'next.config.mjs': 'Next.js config',
    'nuxt.config.ts': 'Nuxt config',
    'tailwind.config.ts': 'Tailwind CSS config',
    'tailwind.config.js': 'Tailwind CSS config',
    'pyproject.toml': 'Python project manifest',
    'requirements.txt': 'Python dependencies',
    'setup.py': 'Python package setup',
    'Makefile': 'Build automation',
    'go.mod': 'Go module definition',
    'Cargo.toml': 'Rust project manifest',
    '.github/workflows': 'GitHub Actions CI/CD',
};

const ENTRY_FILE_NAMES = new Set([
    'index.ts', 'index.js', 'index.mjs',
    'main.ts', 'main.js', 'main.py',
    'app.ts', 'app.js', 'app.py',
    'server.ts', 'server.js', 'server.py',
    'cli.ts', 'cli.js',
    'mod.ts', 'mod.rs',
    'manage.py', 'wsgi.py', 'asgi.py',
]);

// ─── Main Scanner ───────────────────────────────────────────────

export function generateRepoMap(repoPath: string, maxDepth: number = 3): RepoMapResult {
    const langCounts = new Map<string, { name: string; ext: string; count: number }>();
    const dirAnnotations: DirAnnotation[] = [];
    const configFiles: ConfigFile[] = [];
    const entryPoints: string[] = [];
    const moduleDeps: ModuleDep[] = [];
    const patterns: string[] = [];

    // ── 1. Scan directory tree ───────────────────────────────
    scanDirectory(repoPath, repoPath, 0, maxDepth, langCounts, dirAnnotations, entryPoints);

    // ── 2. Detect config files ──────────────────────────────
    for (const [file, purpose] of Object.entries(CONFIG_FILES)) {
        const fullPath = join(repoPath, file);
        if (existsSync(fullPath)) {
            configFiles.push({ path: file, purpose });
        }
    }

    // ── 3. Calculate language stats ─────────────────────────
    const totalFiles = Array.from(langCounts.values()).reduce((sum, l) => sum + l.count, 0);
    const languages: LanguageStat[] = Array.from(langCounts.values())
        .map(l => ({
            name: l.name,
            extension: l.ext,
            fileCount: l.count,
            percentage: totalFiles > 0 ? Math.round((l.count / totalFiles) * 100) : 0,
        }))
        .sort((a, b) => b.fileCount - a.fileCount);

    // ── 4. Detect architecture type ─────────────────────────
    const archType = detectArchType(repoPath, dirAnnotations);

    // ── 5. Detect entry points from package.json ────────────
    detectPackageEntryPoints(repoPath, entryPoints);

    // ── 6. Detect module dependencies (top-level only) ──────
    detectModuleDeps(repoPath, dirAnnotations, moduleDeps);

    // ── 7. Detect architecture patterns ─────────────────────
    detectPatterns(dirAnnotations, configFiles, patterns);

    return {
        archType,
        languages,
        entryPoints: [...new Set(entryPoints)],
        dirAnnotations,
        configFiles,
        moduleDeps,
        patterns,
    };
}

// ─── Helpers ────────────────────────────────────────────────────

function scanDirectory(
    rootPath: string,
    currentPath: string,
    depth: number,
    maxDepth: number,
    langCounts: Map<string, { name: string; ext: string; count: number }>,
    dirAnnotations: DirAnnotation[],
    entryPoints: string[],
): void {
    if (depth > maxDepth) return;

    let entries;
    try {
        entries = readdirSync(currentPath, { withFileTypes: true });
    } catch {
        return;
    }

    let fileCount = 0;

    for (const entry of entries) {
        if (entry.name.startsWith('.') && SKIP_DIRS.has(entry.name)) continue;
        if (SKIP_DIRS.has(entry.name)) continue;

        const fullPath = join(currentPath, entry.name);

        if (entry.isDirectory()) {
            // Annotate directory
            const relPath = relative(rootPath, fullPath);
            const purpose = DIR_PURPOSE_MAP[entry.name.toLowerCase()] ?? '';
            const childCount = countFiles(fullPath);

            if (purpose || depth < 2) {
                dirAnnotations.push({
                    path: relPath.replace(/\\/g, '/'),
                    purpose,
                    fileCount: childCount,
                    depth,
                });
            }

            // Recurse
            scanDirectory(rootPath, fullPath, depth + 1, maxDepth, langCounts, dirAnnotations, entryPoints);
        } else if (entry.isFile()) {
            fileCount++;
            const ext = extname(entry.name).toLowerCase();
            const langName = LANG_MAP[ext];

            if (langName) {
                const existing = langCounts.get(langName);
                if (existing) {
                    existing.count++;
                } else {
                    langCounts.set(langName, { name: langName, ext, count: 1 });
                }
            }

            // Check if entry point
            if (ENTRY_FILE_NAMES.has(entry.name) && depth <= 2) {
                const relPath = relative(rootPath, fullPath).replace(/\\/g, '/');
                entryPoints.push(relPath);
            }
        }
    }
}

function countFiles(dirPath: string): number {
    let count = 0;
    try {
        const entries = readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue;
            if (entry.isFile()) count++;
            else if (entry.isDirectory()) count += countFiles(join(dirPath, entry.name));
        }
    } catch { /* ignore */ }
    return count;
}

function detectArchType(
    repoPath: string,
    dirs: DirAnnotation[],
): 'monorepo' | 'workspace' | 'single' {
    // Check for monorepo tools
    const monoFiles = ['turbo.json', 'nx.json', 'lerna.json'];
    for (const f of monoFiles) {
        if (existsSync(join(repoPath, f))) return 'monorepo';
    }

    // Check for workspace dirs
    const workspaceDirs = ['apps', 'packages', 'libs'];
    const hasWorkspace = dirs.some(d => workspaceDirs.includes(d.path));
    if (hasWorkspace) return 'workspace';

    // Check package.json workspaces
    const pkgPath = join(repoPath, 'package.json');
    if (existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
            if (pkg.workspaces) return 'workspace';
        } catch { /* ignore */ }
    }

    return 'single';
}

function detectPackageEntryPoints(repoPath: string, entryPoints: string[]): void {
    const pkgPath = join(repoPath, 'package.json');
    if (!existsSync(pkgPath)) return;

    try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

        if (pkg.main && existsSync(join(repoPath, pkg.main))) {
            entryPoints.push(pkg.main);
        }

        if (pkg.bin) {
            if (typeof pkg.bin === 'string') {
                entryPoints.push(pkg.bin);
            } else if (typeof pkg.bin === 'object') {
                for (const v of Object.values(pkg.bin)) {
                    if (typeof v === 'string') entryPoints.push(v);
                }
            }
        }
    } catch { /* ignore */ }
}

function detectModuleDeps(
    repoPath: string,
    dirs: DirAnnotation[],
    moduleDeps: ModuleDep[],
): void {
    // Only scan top-level dirs that have index files
    const topDirs = dirs.filter(d => d.depth === 1 || (d.depth === 0 && d.path.includes('/')));

    for (const dir of topDirs) {
        const dirPath = join(repoPath, dir.path);
        const indexFiles = ['index.ts', 'index.js', 'index.mjs', 'mod.ts'];

        for (const indexFile of indexFiles) {
            const indexPath = join(dirPath, indexFile);
            if (!existsSync(indexPath)) continue;

            try {
                const content = readFileSync(indexPath, 'utf-8');
                const imports = extractImports(content);

                for (const imp of imports) {
                    // Only track relative imports to other top-level dirs
                    if (imp.startsWith('../') || imp.startsWith('./')) {
                        const resolvedDir = resolveImportDir(dir.path, imp);
                        if (resolvedDir && topDirs.some(d => d.path === resolvedDir)) {
                            moduleDeps.push({ from: dir.path, to: resolvedDir });
                        }
                    }
                }
            } catch { /* ignore */ }
            break; // Only read first found index file
        }
    }
}

function extractImports(content: string): string[] {
    const imports: string[] = [];
    // Match: import ... from '...' or require('...')
    const importRegex = /(?:import\s+.*?\s+from\s+['"](.+?)['"]|require\(['"](.+?)['"]\))/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1] || match[2]);
    }
    return imports;
}

function resolveImportDir(fromDir: string, importPath: string): string | null {
    // Simple resolution: ../core/foo → core
    const parts = importPath.split('/');
    if (parts[0] === '..') {
        return parts[1] ?? null;
    }
    if (parts[0] === '.') {
        return fromDir;
    }
    return null;
}

function detectPatterns(
    dirs: DirAnnotation[],
    configs: ConfigFile[],
    patterns: string[],
): void {
    const dirNames = new Set(dirs.map(d => d.path.split('/').pop()?.toLowerCase()));
    const configPaths = new Set(configs.map(c => c.path));

    // Layered architecture
    const layerDirs = ['controllers', 'services', 'models', 'routes'];
    if (layerDirs.filter(d => dirNames.has(d)).length >= 2) {
        patterns.push('Layered architecture (controllers → services → models)');
    }

    // Feature-based architecture
    if (dirNames.has('features') || dirNames.has('modules') || dirNames.has('domain')) {
        patterns.push('Feature-based / modular architecture');
    }

    // NestJS patterns
    const nestDirs = ['guards', 'pipes', 'interceptors', 'decorators', 'dto'];
    if (nestDirs.filter(d => dirNames.has(d)).length >= 2) {
        patterns.push('NestJS-style module pattern');
    }

    // Database
    if (configPaths.has('prisma/schema.prisma')) {
        patterns.push('Prisma ORM with migration history');
    }

    // Docker
    if (configPaths.has('Dockerfile') || configPaths.has('docker-compose.yml') || configPaths.has('docker-compose.yaml')) {
        patterns.push('Docker containerization');
    }

    // CI/CD
    if (configPaths.has('.github/workflows')) {
        patterns.push('GitHub Actions CI/CD');
    }

    // Testing
    if (configPaths.has('vitest.config.ts') || configPaths.has('jest.config.ts') || configPaths.has('jest.config.js')) {
        patterns.push('Automated test suite');
    }

    // Monorepo tooling
    if (configPaths.has('turbo.json')) patterns.push('Turborepo build pipeline');
    if (configPaths.has('nx.json')) patterns.push('Nx workspace');

    // Component library
    if (dirNames.has('components') && (dirNames.has('hooks') || dirNames.has('composables'))) {
        patterns.push('Component-driven UI with custom hooks');
    }
}
