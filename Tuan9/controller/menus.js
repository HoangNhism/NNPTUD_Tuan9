let menuSchema = require('../schemas/menu');

module.exports = {
    getAllMenus: async function() {
        return menuSchema.find({}).sort({ order: 1 }).populate('parent');
    },
    
    getMenuById: async function(id) {
        return menuSchema.findById(id).populate('parent');
    },
    
    getMenusByParent: async function(parentId) {
        // If null, get top-level menus
        const query = parentId ? { parent: parentId } : { parent: null };
        return menuSchema.find(query).sort({ order: 1 });
    },
    
    createMenu: async function(text, URL, order, parentId) {
        const menuData = {
            text: text,
            URL: URL,
            order: order || 0
        };
        
        if (parentId) {
            // Check if parent exists
            const parentMenu = await menuSchema.findById(parentId);
            if (!parentMenu) {
                throw new Error('Parent menu does not exist');
            }
            menuData.parent = parentId;
        }
        
        const newMenu = new menuSchema(menuData);
        return await newMenu.save();
    },
    
    updateMenu: async function(id, body) {
        const menu = await this.getMenuById(id);
        if (!menu) {
            throw new Error('Menu not found');
        }
        
        const allowedFields = ['text', 'URL', 'order', 'parent'];
        for (const key of Object.keys(body)) {
            if (allowedFields.includes(key)) {
                // If updating parent, ensure it exists and isn't self-referencing
                if (key === 'parent' && body[key]) {
                    if (body[key] === id) {
                        throw new Error('Menu cannot be its own parent');
                    }
                    const parentExists = await menuSchema.findById(body[key]);
                    if (!parentExists) {
                        throw new Error('Parent menu does not exist');
                    }
                }
                menu[key] = body[key];
            }
        }
        
        return await menu.save();
    },
    
    deleteMenu: async function(id) {
        // First check if this menu is a parent of other menus
        const childMenus = await menuSchema.find({ parent: id });
        if (childMenus.length > 0) {
            throw new Error('Cannot delete menu with children. Please delete or reassign child menus first.');
        }
        
        return await menuSchema.findByIdAndDelete(id);
    }
};