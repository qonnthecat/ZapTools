// js/tools/index.js
class ToolsAutoLoader {
    constructor() {
        this.tools = new Map();
        this.categories = new Map();
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Daftar tools yang tersedia
            const toolFolders = [
                'password-generator',
                'color-tools'
            ];

            for (const folder of toolFolders) {
                await this.loadTool(folder);
            }

            this.initialized = true;
            console.log('Tools AutoLoader initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Tools AutoLoader:', error);
        }
    }

    async loadTool(folderName) {
        try {
            // Load manifest dengan fetch (lebih kompatibel)
            const manifestResponse = await fetch(`./js/tools/${folderName}/manifest.json`);
            if (!manifestResponse.ok) {
                throw new Error(`Manifest not found for ${folderName}`);
            }
            const toolConfig = await manifestResponse.json();

            // Load template
            const templateModule = await import(`./${folderName}/template.js`);
            
            // Load service
            const serviceModule = await import(`./${folderName}/${folderName}.js`);

            const tool = {
                id: folderName,
                ...toolConfig,
                template: templateModule.default || templateModule[`${this.toPascalCase(folderName)}Template`],
                service: serviceModule.default || serviceModule[this.toPascalCase(folderName)]
            };

            this.tools.set(tool.id, tool);

            // Update categories
            if (!this.categories.has(tool.category)) {
                this.categories.set(tool.category, {
                    name: tool.categoryName || tool.category,
                    icon: tool.categoryIcon,
                    description: tool.categoryDescription,
                    tools: []
                });
            }
            this.categories.get(tool.category).tools.push(tool.id);

            console.log(`Tool loaded: ${tool.name}`);
            return tool;

        } catch (error) {
            console.error(`Failed to load tool ${folderName}:`, error);
            return null;
        }
    }

    toPascalCase(str) {
        return str.replace(/(^\w|-\w)/g, (match) => 
            match.replace(/-/, '').toUpperCase()
        );
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }

    getToolsByCategory(category) {
        const categoryData = this.categories.get(category);
        if (!categoryData) return [];
        
        return categoryData.tools.map(toolId => this.tools.get(toolId));
    }

    getCategories() {
        return Array.from(this.categories.values());
    }

    getTool(toolId) {
        return this.tools.get(toolId);
    }

    async getToolTemplate(toolId) {
        const tool = this.tools.get(toolId);
        return tool ? tool.template() : '';
    }

    async initToolService(toolId) {
        const tool = this.tools.get(toolId);
        if (!tool || !tool.service) return null;

        try {
            const service = new tool.service();
            await service.init();
            return service;
        } catch (error) {
            console.error(`Failed to initialize tool service ${toolId}:`, error);
            return null;
        }
    }
}

export const toolsLoader = new ToolsAutoLoader();