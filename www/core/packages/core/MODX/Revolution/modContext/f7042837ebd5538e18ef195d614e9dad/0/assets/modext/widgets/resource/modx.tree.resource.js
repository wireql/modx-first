/**
 * Generates the Resource Tree in Ext
 *
 * @class MODx.tree.Resource
 * @extends MODx.tree.Tree
 * @param {Object} config An object of options.
 * @xtype modx-tree-resource
 */
MODx.tree.Resource = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: MODx.config.connector_url
        ,action: 'Resource/GetNodes'
        ,title: ''
        ,rootVisible: false
        ,expandFirst: true
        ,enableDD: (MODx.config.enable_dragdrop != '0') ? true : false
        ,ddGroup: 'modx-treedrop-dd'
        ,sortAction: 'Resource/Sort'
        ,sortBy: this.getDefaultSortBy(config)
        ,tbarCfg: {
            id: config.id ? config.id+'-tbar' : 'modx-tree-resource-tbar'
        }
        ,baseParams: {
            sortBy: this.getDefaultSortBy(config)
            ,currentResource: MODx.request.id || 0
            ,currentAction: MODx.request.a || 0
        }
    });
    MODx.tree.Resource.superclass.constructor.call(this,config);
    this.addEvents('loadCreateMenus', 'emptyTrash');
    this.on('afterSort',this._handleAfterDrop,this);
};
Ext.extend(MODx.tree.Resource,MODx.tree.Tree,{
    forms: {}
    ,windows: {}
    ,stores: {}

    ,getToolbar: function() {
        return [];
    }

    ,_initExpand: function() {
        var treeState = Ext.state.Manager.get(this.treestate_id);
        if ((Ext.isString(treeState) || Ext.isEmpty(treeState)) && this.root) {
            if (this.root) {this.root.expand();}
            var wn = this.getNodeById('web_0');
            if (wn && this.config.expandFirst) {
                wn.select();
                wn.expand();
            }
        } else {
            // If we have disabled context sort, make sure dragging and dropping is disabled on the root elements
            // in the tree. This corresponds to the context nodes.
            if (MODx.config.context_tree_sort !== '1') {
                if (typeof(this.root) !== 'undefined' && typeof(this.root.childNodes) !== 'undefined') {
                    for (var i = 0; i < this.root.childNodes.length; i++) {
                        this.root.childNodes[i].draggable = false;
                    }
                }
            }

            for (var i=0;i<treeState.length;i++) {
                this.expandPath(treeState[i]);
            }
        }
    }

    /**
     * Shows the current context menu.
     * @param {Ext.tree.TreeNode} n The current node
     * @param {Ext.EventObject} e The event object run.
     */
    ,_showContextMenu: function(n,e) {
        this.cm.activeNode = n;
        this.cm.removeAll();
        if (n.attributes.menu && n.attributes.menu.items) {
            this.addContextMenuItem(n.attributes.menu.items);
        } else {
            var m = [];
            switch (n.attributes.type) {
                case 'MODX\\Revolution\\modResource':
                case 'MODX\\Revolution\\modDocument':
                    m = this._getModResourceMenu(n);
                    break;
                case 'MODX\\Revolution\\modContext':
                    m = this._getModContextMenu(n);
                    break;
            }

            this.addContextMenuItem(m);
        }
        this.cm.showAt(e.xy);
        e.stopEvent();
    }

    ,duplicateResource: function(item,e) {
        var node = this.cm.activeNode;
        var id = node.id.split('_');id = id[1];
        var name = Ext.util.Format.htmlEncode(node.ui.textNode.innerText);

        var r = {
            resource: id
            ,is_folder: node.getUI().hasClass('folder')
        };
        var w = MODx.load({
            xtype: 'modx-window-resource-duplicate'
            ,resource: id
            ,pagetitle: name
            ,hasChildren: node.attributes.hasChildren
            ,childCount: node.attributes.childCount
            ,redirect: false
            ,listeners: {
                'success': {fn:function(r) {
                    var response = Ext.decode(r.a.response.responseText);
                    if (response.object.redirect) {
                        MODx.loadPage('resource/update', 'id='+response.object.id);
                    } else {
                        node.parentNode.attributes.childCount = parseInt(node.parentNode.attributes.childCount) + 1;
                        this.refreshNode(node.id);
                    }
                },scope:this}
            }
        });
        w.config.hasChildren = node.attributes.hasChildren;
        w.setValues(r);
        w.show(e.target);
    }

    ,duplicateContext: function(itm,e) {
        var node = this.cm.activeNode;
        var key = node.attributes.pk;

        var r = {
            key: key
            ,newkey: ''
        };
        var w = MODx.load({
            xtype: 'modx-window-context-duplicate'
            ,record: r
            ,listeners: {
                'success': {fn:function() {this.refresh();},scope:this}
            }
        });
        w.show(e.target);
    }

    ,removeContext: function(itm,e) {
        var node = this.cm.activeNode;
        var key = node.attributes.pk;
        MODx.msg.confirm({
            title: _('remove_context')
            ,text: _('context_remove_confirm')
            ,url: MODx.config.connector_url
            ,params: {
                action: 'Context/Remove'
                ,key: key
            }
            ,listeners: {
                'success': {fn:function() {
                    var cmp = Ext.getCmp('modx-grid-context');

                    if (cmp) {
                        cmp.refresh();
                    }

                    this.refresh();
                },scope:this}
            }
        });
    }

    ,preview: function() {
        window.open(this.cm.activeNode.attributes.preview_url);
    }

    ,deleteDocument: function() {
        const node = this.cm.activeNode;
        const id = node.id.split('_')[1];
        const resource = Ext.util.Format.htmlEncode(node.ui.textNode.innerText);

        MODx.msg.confirm({
            text: _('resource_delete_confirm', { resource }),
            url: MODx.config.connector_url,
            params: {
                action: 'Resource/Delete',
                id,
            },
            listeners: {
                success: {
                    fn: (data) => {
                        const deletedCount = +data.object.deletedCount;
                        Ext.getCmp('modx-trash-link')?.updateState(deletedCount);

                        const nodeUI = node.getUI();
                        nodeUI.addClass('deleted');
                        node.cascade((childNode) => childNode.getUI().addClass('deleted'), this);

                        // Refresh the trash manager if possible
                        Ext.getCmp('modx-trash-resources')?.refresh();

                        Ext.get(nodeUI.getEl()).frame();

                        // Handle deleted resource in update panel
                        const updatePanel = Ext.getCmp('modx-panel-resource');
                        if (updatePanel && MODx.request.a === 'resource/update' && MODx.request.id === id) {
                            updatePanel.handleDeleted(true);
                        }
                    },
                    scope: this,
                },
            }
        });
    }

    ,undeleteDocument: function() {
        const node = this.cm.activeNode;
        const id = node.id.split('_')[1];

        MODx.Ajax.request({
            url: MODx.config.connector_url,
            params: {
                action: 'Resource/Undelete',
                id,
            },
            listeners: {
                success: {
                    fn: function(response) {
                        const deletedCount = +response.object.deletedCount;
                        Ext.getCmp('modx-trash-link')?.updateState(deletedCount);

                        const activeNodeUI = node.getUI();

                        activeNodeUI.removeClass('deleted');
                        node.cascade((childNode) => childNode.getUI().removeClass('deleted'), this);

                        const trashResourcesPanel = Ext.getCmp('modx-trash-resources');
                        if (trashResourcesPanel) {
                            trashResourcesPanel.refresh();
                        }

                        Ext.get(activeNodeUI.getEl()).frame();

                        const updatePanel = Ext.getCmp('modx-panel-resource');
                        if (updatePanel && MODx.request.a === 'resource/update' && MODx.request.id === id) {
                            updatePanel.handleDeleted(false);
                        }
                    },
                    scope: this
                }
            }
        });
    }

    ,purgeDocument: function(itm,e) {
        const node = this.cm.activeNode;
        const id = node.id.split('_')[1];
        const name = Ext.util.Format.htmlEncode(node.ui.textNode.innerText);

        MODx.msg.confirm({
            text: _('resource_purge_confirm',{
                resource: name + ' ('+ id + ')'
            }),
            url: MODx.config.connector_url,
            params: {
                action: 'Resource/Trash/Purge',
                ids: id
            },
            listeners: {
                success: {
                    fn: function(data) {
                        if (MODx.request.a === 'resource/update' && MODx.request.id === id) {
                            const updatePanel = Ext.getCmp('modx-panel-resource');
                            if (updatePanel) {
                                updatePanel.warnUnsavedChanges = false;
                            }
                            MODx.loadPage('?');

                            return;
                        }

                        Ext.getCmp('modx-trash-link')?.updateState(+data.object.deletedCount);

                        node.remove();

                        // refresh the trash manager if possible
                        Ext.getCmp('modx-trash-resources')?.refresh();

                        MODx.msg.status({
                            title: _('success'),
                            message: data.message,
                        });
                    },
                    scope: this,
                },
            },
        });
    }

    ,publishDocument: function(itm,e) {
        var node = this.cm.activeNode;
        var id = node.id.split('_');id = id[1];
        MODx.msg.confirm({
            title: _('resource_publish')
            ,text: _('resource_publish_confirm')
            ,url: MODx.config.connector_url
            ,params: {
                action: 'Resource/Publish'
                ,id: id
            }
            ,listeners: {
                'success': {fn:function() {
                    var ui = this.cm.activeNode.getUI();
                    ui.removeClass('unpublished');
                    Ext.get(ui.getEl()).frame();
                },scope:this}
            }
        });
    }

    ,unpublishDocument: function(itm,e) {
        var node = this.cm.activeNode;
        var id = node.id.split('_');id = id[1];
        MODx.msg.confirm({
            title: _('resource_unpublish')
            ,text: _('resource_unpublish_confirm')
            ,url: MODx.config.connector_url
            ,params: {
                action: 'Resource/Unpublish'
                ,id: id
            }
            ,listeners: {
                'success': {fn:function() {
                    var ui = this.cm.activeNode.getUI();
                    ui.addClass('unpublished');
                    Ext.get(ui.getEl()).frame();
                },scope:this}
            }
        });
    }

    ,getDefaultSortBy: function(config) {
        var v = 'menuindex';
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.sortBy)) {
            v = config.sortBy;
        } else {
            var d = Ext.state.Manager.get(this.treestate_id+'-sort-default');
            if (d != MODx.config.tree_default_sort) {
                v = MODx.config.tree_default_sort;
                Ext.state.Manager.set(this.treestate_id+'-sort-default',v);
                Ext.state.Manager.set(this.treestate_id+'-sort',v);
            } else {
                v = Ext.state.Manager.get(this.treestate_id+'-sort') || MODx.config.tree_default_sort;
            }
        }
        return v;
    }

    ,filterSort: function(itm, e) {
        this.getLoader().baseParams = {
            action: this.config.action
            ,sortBy: itm.sortBy
            ,sortDir: itm.sortDir
            ,node: this.cm.activeNode.ide
        };
        this.refreshActiveNode()
    }


    ,hideFilter: function(itm,e) {
        this.filterBar.destroy();
        this._filterVisible = false;
    }

    ,_handleAfterDrop: function(o,r) {
        var targetNode = o.event.target;
        var dropNode = o.event.dropNode;
        if (o.event.point == 'append' && targetNode) {
            var ui = targetNode.getUI();
            ui.addClass('haschildren');
            ui.removeClass('icon-resource');
        }
        if((MODx.request.a === 'resource/update')){
            if(dropNode.attributes.pk == MODx.request.id) {
                var parentFieldCmb = Ext.getCmp('modx-resource-parent');
                var parentFieldHidden = Ext.getCmp('modx-resource-parent-hidden');
                if(parentFieldCmb && parentFieldHidden){
                    parentFieldHidden.setValue(dropNode.parentNode.attributes.pk);
                    parentFieldCmb.setValue(dropNode.parentNode.attributes.text.replace(/(<([^>]+)>)/ig,""));
                }
            }
            var menuindexField = Ext.getCmp('modx-resource-menuindex');
            if(menuindexField && o.result.object.menuindex !== undefined){
                menuindexField.setValue(o.result.object.menuindex);
            }
            var isfolderFieldCmb = Ext.getCmp('modx-resource-isfolder');
            if(isfolderFieldCmb && typeof o.result.object.isfolder === 'boolean'){
                isfolderFieldCmb.setValue(o.result.object.isfolder);
            }
        }
    }

    ,_handleDrop:  function(e){
        var dropNode = e.dropNode;
        var targetParent = e.target;

        if (targetParent.findChild('id',dropNode.attributes.id) !== null) {return false;}

        if (dropNode.attributes.type == 'modContext' && (targetParent.getDepth() > 1 || (targetParent.attributes.id == targetParent.attributes.pk + '_0' && e.point == 'append'))) {
            return false;
        }

        if (dropNode.attributes.type !== 'modContext' && targetParent.getDepth() <= 1 && e.point !== 'append') {
            return false;
        }

        if (MODx.config.resource_classes_drop[targetParent.attributes.classKey] == undefined) {
            if (targetParent.attributes.hide_children_in_tree) { return false; }
        } else if (MODx.config.resource_classes_drop[targetParent.attributes.classKey] == 0) {
            return false;
        }

        return dropNode.attributes.text != 'root' && dropNode.attributes.text !== ''
            && targetParent.attributes.text != 'root' && targetParent.attributes.text !== '';
    }

    ,getContextSettingForNode: function(node,ctx,setting,dv) {
        var val = dv || null;
        if (node.attributes.type != 'modContext') {
            var t = node.getOwnerTree();
            var rn = t.getRootNode();
            var cn = rn.findChild('ctx',ctx,false);
            if (cn) {
                val = cn.attributes.settings[setting];
            }
        } else {
            val = node.attributes.settings[setting];
        }
        return val;
    }

    ,quickCreate: function(itm,e,cls,ctx,p) {
        cls = cls || 'MODX\\Revolution\\modDocument';
        var r = {
            class_key: cls
            ,context_key: ctx || 'web'
            ,'parent': p || 0
            ,'template': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'default_template',MODx.config.default_template))
            ,'richtext': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'richtext_default',MODx.config.richtext_default))
            ,'hidemenu': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'hidemenu_default',MODx.config.hidemenu_default))
            ,'searchable': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'search_default',MODx.config.search_default))
            ,'cacheable': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'cache_default',MODx.config.cache_default))
            ,'published': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'publish_default',MODx.config.publish_default))
            ,'content_type': parseInt(this.getContextSettingForNode(this.cm.activeNode,ctx,'default_content_type',MODx.config.default_content_type))
        };
        if (this.cm.activeNode.attributes.type != 'modContext') {
            var t = this.cm.activeNode.getOwnerTree();
            var rn = t.getRootNode();
            var cn = rn.findChild('ctx',ctx,false);
            if (cn) {
                r['template'] = cn.attributes.settings.default_template;
            }
        } else {
            r['template'] = this.cm.activeNode.attributes.settings.default_template;
        }

        var w = MODx.load({
            xtype: 'modx-window-quick-create-modResource'
            ,record: r
            ,listeners: {
                'success':{
                    fn: function() {
                        this.refreshNode(this.cm.activeNode.id, this.cm.activeNode.childNodes.length > 0);
                    }
                    ,scope: this}
                ,'hide':{fn:function() {this.destroy();}}
                ,'show':{fn:function() {this.center();}}
            }
        });
        w.setValues(r);
        w.show(e.target,function() {
            Ext.isSafari ? w.setPosition(null,30) : w.center();
        },this);
    }

    ,quickUpdate: function(itm,e,cls) {
        MODx.Ajax.request({
            url: MODx.config.connector_url
            ,params: {
                action: 'Resource/Get'
                ,id: this.cm.activeNode.attributes.pk
                ,skipFormatDates: true
            }
            ,listeners: {
                'success': {fn:function(r) {
                    var pr = r.object;
                    pr.class_key = cls;

                    var w = MODx.load({
                        xtype: 'modx-window-quick-update-modResource'
                        ,record: pr
                        ,listeners: {
                            'success':{fn:function(r) {
                                this.refreshNode(this.cm.activeNode.id);
                                var newTitle = '<span dir="ltr">' + r.f.findField('pagetitle').getValue() + ' (' + w.record.id + ')</span>';
                                w.setTitle(w.title.replace(/<span.*\/span>/, newTitle));
                            },scope:this}
                            ,'hide':{fn:function() {this.destroy();}}
                        }
                    });
                    w.title += ': <span dir="ltr">' + Ext.util.Format.htmlEncode(w.record.pagetitle) + ' ('+ w.record.id + ')</span>';
                    w.setValues(r.object);
                    w.show(e.target,function() {
                        Ext.isSafari ? w.setPosition(null,30) : w.center();
                    },this);
                },scope:this}
            }
        });
    }

    ,_getModContextMenu: function(n) {
        var a = n.attributes;
        var ui = n.getUI();
        var m = [];

        m.push({
            text: '<b>'+a.text+' ('+a.ctx+')</b>'
            ,handler: function() {return false;}
            ,header: true
        });
        m.push('-');
        m.push({
            text: _('refresh_context')
            ,handler: function() {
                this.refreshNode(this.cm.activeNode.id,true);
            }
        });
        if (ui.hasClass('pedit')) {
            m.push({
                text: _('edit_context')
                ,handler: function() {
                    var at = this.cm.activeNode.attributes;
                    this.loadAction('a=context/update&key='+at.pk);
                }
            });
        }
        if (ui.hasClass('pnew')) {
            m.push({
                text: _('duplicate_context')
                ,handler: this.duplicateContext
            });
        }
        if (ui.hasClass('pdelete')) {
            m.push('-');
            m.push({
                text: _('remove_context')
                ,handler: this.removeContext
            });
        }
        if (ui.hasClass('pnewdoc')) {
            m.push('-');
            this._getCreateMenus(m,'0',ui);
        }
        if(!ui.hasClass('x-tree-node-leaf')) {
            m.push('-');
            m.push(this._getSortMenu());
        }

        return m;
    }

    ,overviewResource: function() {this.loadAction('a=resource/data')}

    ,quickUpdateResource: function(itm,e) {
        this.quickUpdate(itm,e,itm.classKey);
    }

    ,editResource: function() {this.loadAction('a=resource/update');}

    ,_getModResourceMenu: function(n) {
        var a = n.attributes;
        var ui = n.getUI();
        var m = [];
        m.push({
            text: '<b>'+a.text+'</b>'
            ,handler: function() {return false;}
            ,header: true
        });
        m.push('-');
        if (ui.hasClass('pview')) {
            m.push({
                text: _('resource_overview')
                ,handler: this.overviewResource
            });
        }
        if (ui.hasClass('pedit')) {
            m.push({
                text: _('resource_edit')
                ,handler: this.editResource
            });
        }
        if (ui.hasClass('pqupdate')) {
            m.push({
                text: _('quick_update_resource')
                ,classKey: a.classKey
                ,handler: this.quickUpdateResource
            });
        }
        if (ui.hasClass('pduplicate')) {
            m.push({
                text: _('resource_duplicate')
                ,handler: this.duplicateResource
            });
        }
        m.push({
            text: _('resource_refresh')
            ,handler: this.refreshResource
            ,scope: this
        });

        if (ui.hasClass('pnew')) {
            m.push('-');
            this._getCreateMenus(m,null,ui);
        }

        if (ui.hasClass('psave')) {
            m.push('-');
            if (ui.hasClass('ppublish') && ui.hasClass('unpublished')) {
                m.push({
                    text: _('resource_publish')
                    ,handler: this.publishDocument
                });
            } else if (ui.hasClass('punpublish')) {
                m.push({
                    text: _('resource_unpublish')
                    ,handler: this.unpublishDocument
                });
            }
            if (ui.hasClass('pundelete') && ui.hasClass('deleted')) {
                m.push({
                    text: _('resource_undelete')
                    ,handler: this.undeleteDocument
                });
                m.push({
                    text: _('resource_purge')
                    ,handler: this.purgeDocument
                });
            } else if (ui.hasClass('pdelete') && !ui.hasClass('deleted')) {
                m.push({
                    text: _('resource_delete')
                    ,handler: this.deleteDocument
                });
            }
        }

        if(!ui.hasClass('x-tree-node-leaf')) {
            m.push('-');
            m.push(this._getSortMenu());
        }

        if (ui.hasClass('pview') && a.preview_url != '') {
            m.push('-');
            m.push({
                text: _('resource_view')
                ,handler: this.preview
            });
        }
        return m;
    }

    ,refreshResource: function() {
        this.refreshNode(this.cm.activeNode.id);
    }

    ,createResourceHere: function(itm) {

        var at = this.cm.activeNode.attributes;
        var parent = itm.usePk ? itm.usePk : at.pk;

        if (parseInt(MODx.config.enable_template_picker_in_tree)) {
            MODx.createResource({
                'class_key': itm.classKey,
                'parent': parent,
                'context_key': at.ctx || MODx.config.default_context
            });
        } else {
            this.loadAction(
               'a=resource/create&class_key=' + itm.classKey + '&parent=' + parent + (at.ctx ? '&context_key='+at.ctx : '')
            );
        }
    }

    ,createResource: function(itm,e) {
        var at = this.cm.activeNode.attributes;
        var p = itm.usePk ? itm.usePk : at.pk;
        this.quickCreate(itm,e,itm.classKey,at.ctx,p);
    }

    ,_getCreateMenus: function(m,pk,ui) {
        var types = MODx.config.resource_classes;
        var o = this.fireEvent('loadCreateMenus',types);
        if (Ext.isObject(o)) {
            Ext.apply(types,o);
        }
        var coreTypes = ['MODX\Revolution\modDocument','MODX\Revolution\modWebLink','MODX\Revolution\modSymLink','MODX\Revolution\modStaticResource'];
        var ct = [];
        var qct = [];
        for (var k in types) {
            if (coreTypes.indexOf(k) != -1) {
                if (!ui.hasClass('pnew_'+k)) {
                    continue;
                }
            }
            ct.push({
                text: types[k]['text_create_here']
                ,classKey: k
                ,usePk: pk ? pk : false
                ,handler: this.createResourceHere
                ,scope: this
            });
            if (ui && ui.hasClass('pqcreate')) {
                qct.push({
                    text: types[k]['text_create']
                    ,classKey: k
                    ,handler: this.createResource
                    ,scope: this
                });
            }
        }
        m.push({
            text: _('create')
            ,handler: function() {return false;}
            ,menu: {items: ct}
        });
        if (ui && ui.hasClass('pqcreate')) {
            m.push({
                text: _('quick_create')
                ,handler: function() {return false;}
                ,menu: {items: qct}
            });
        }

        return m;
    }

    /**
     * Handles all drag events into the tree.
     * @param {Object} dropEvent The node dropped on the parent node.
     */
    ,_handleDrag: function(dropEvent) {
        function simplifyNodes(node) {
            var resultNode = {};
            var kids = node.childNodes;
            var len = kids.length;
            for (var i = 0; i < len; i++) {
                resultNode[kids[i].id] = simplifyNodes(kids[i]);
            }
            return resultNode;
        }

        var encNodes = Ext.encode(simplifyNodes(dropEvent.tree.root));
        this.fireEvent('beforeSort',encNodes);
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                target: dropEvent.target.attributes.id
                ,activeTarget: MODx.request.a === 'resource/update' ? MODx.request.id : ''
                ,source: dropEvent.source.dragData.node.attributes.id
                ,point: dropEvent.point
                ,data: encodeURIComponent(encNodes)
                ,action: this.config.sortAction || 'sort'
            }
            ,listeners: {
                'success': {fn:function(r) {
                    var el = dropEvent.dropNode.getUI().getTextEl();
                    if (el) {Ext.get(el).frame();}
                    this.fireEvent('afterSort',{event:dropEvent,result:r});
                },scope:this}
                ,'failure': {fn:function(r) {
                    MODx.form.Handler.errorJSON(r);
                    this.refresh();
                    return false;
                },scope:this}
            }
        });
    }

    ,_getSortMenu: function(){
        return [{
            text: _('sort_by')
            ,handler: function() {return false;}
            ,menu: {
                items:[{
                    text: _('tree_order')
                    ,sortBy: 'menuindex'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('recently_updated')
                    ,sortBy: 'editedon'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('newest')
                    ,sortBy: 'createdon'
                    ,sortDir: 'DESC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('oldest')
                    ,sortBy: 'createdon'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('publish_date')
                    ,sortBy: 'pub_date'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('unpublish_date')
                    ,sortBy: 'unpub_date'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('publishedon')
                    ,sortBy: 'publishedon'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('title')
                    ,sortBy: 'pagetitle'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                },{
                    text: _('alias')
                    ,sortBy: 'alias'
                    ,sortDir: 'ASC'
                    ,handler: this.filterSort
                    ,scope: this
                }]
            }
        }];
    }

    ,handleCreateClick: function(node){
        this.cm.activeNode = node;
        var itm = {
            usePk: '0'
            ,classKey: 'MODX\\Revolution\\modDocument'
        };

        this.createResourceHere(itm);
    }

    ,handleDirectCreateClick: function(node){
        this.cm.activeNode = node;
        this.createResourceHere({
            classKey: 'MODX\\Revolution\\modDocument'
        });
    }

    /**
     * Renders the item text without any special formatting. The Resource/GetNodes processor already protects against XSS.
     */
    ,renderItemText: function(item) {
        return item.text;
    }
});
Ext.reg('modx-tree-resource',MODx.tree.Resource);



MODx.window.QuickCreateResource = function(config) {
    config = config || {};
    this.ident = config.ident || 'qcr'+Ext.id();
    Ext.applyIf(config,{
        title: _('quick_create_resource')
        ,id: this.ident
        ,bwrapCssClass: 'x-window-with-tabs'
        ,width: 700
        ,layout: 'anchor'
        ,url: MODx.config.connector_url
        ,action: 'Resource/Create'
        ,fields: [{
            xtype: 'modx-tabs'
            ,bodyStyle: { background: 'transparent' }
            ,border: true
            ,deferredRender: false
            ,autoHeight: false
            ,autoScroll: false
            ,anchor: '100% 100%'
            ,items: [{
                title: _('resource')
                ,layout: 'form'
                ,cls: 'modx-panel'
                ,autoHeight: false
                ,anchor: '100% 100%'
                ,labelWidth: 100
                ,items: [{
                    xtype: 'hidden'
                    ,name: 'id'
                },{
                    layout: 'column'
                    ,border: false
                    ,items: [{
                        columnWidth: .6
                        ,border: false
                        ,layout: 'form'
                        ,items: [{
                            xtype: 'textfield'
                            ,name: 'pagetitle'
                            ,id: 'modx-'+this.ident+'-pagetitle'
                            ,fieldLabel: _('resource_pagetitle')
                            ,description: '<b>[[*pagetitle]]</b><br />'+_('resource_pagetitle_help')
                            ,anchor: '100%'
                            ,allowBlank: false
                        },{
                            xtype: 'textfield'
                            ,name: 'longtitle'
                            ,id: 'modx-'+this.ident+'-longtitle'
                            ,fieldLabel: _('resource_longtitle')
                            ,description: '<b>[[*longtitle]]</b><br />'+_('resource_longtitle_help')
                            ,anchor: '100%'
                        },{
                            xtype: 'textarea'
                            ,name: 'description'
                            ,id: 'modx-'+this.ident+'-description'
                            ,fieldLabel: _('resource_description')
                            ,description: '<b>[[*description]]</b><br />'+_('resource_description_help')
                            ,anchor: '100%'
                            ,grow: false
                            ,height: 50
                        },{
                            xtype: 'textarea'
                            ,name: 'introtext'
                            ,id: 'modx-'+this.ident+'-introtext'
                            ,fieldLabel: _('resource_summary')
                            ,description: '<b>[[*introtext]]</b><br />'+_('resource_summary_help')
                            ,anchor: '100%'
                            ,height: 50
                        }]
                    },{
                        columnWidth: .4
                        ,border: false
                        ,layout: 'form'
                        ,items: [{
                            xtype: 'modx-combo-template'
                            ,name: 'template'
                            ,id: 'modx-'+this.ident+'-template'
                            ,fieldLabel: _('resource_template')
                            ,description: '<b>[[*template]]</b><br />'+_('resource_template_help')
                            ,editable: false
                            ,anchor: '100%'
                            ,baseParams: {
                                action: 'Element/Template/GetList'
                                ,combo: true
                            }
                            ,value: MODx.config.default_template
                        },{
                            xtype: 'textfield'
                            ,name: 'alias'
                            ,id: 'modx-'+this.ident+'-alias'
                            ,fieldLabel: _('resource_alias')
                            ,description: '<b>[[*alias]]</b><br />'+_('resource_alias_help')
                            ,anchor: '100%'
                        },{
                            xtype: 'textfield'
                            ,name: 'menutitle'
                            ,id: 'modx-'+this.ident+'-menutitle'
                            ,fieldLabel: _('resource_menutitle')
                            ,description: '<b>[[*menutitle]]</b><br />'+_('resource_menutitle_help')
                            ,anchor: '100%'
                        },{
                            xtype: 'textfield'
                            ,fieldLabel: _('resource_link_attributes')
                            ,description: '<b>[[*link_attributes]]</b><br />'+_('resource_link_attributes_help')
                            ,name: 'link_attributes'
                            ,id: 'modx-'+this.ident+'-attributes'
                            ,maxLength: 255
                            ,anchor: '100%'
                        },{
                            xtype: 'xcheckbox'
                            ,boxLabel: _('resource_hide_from_menus')
                            ,description: '<b>[[*hidemenu]]</b><br />'+_('resource_hide_from_menus_help')
                            ,hideLabel: true
                            ,name: 'hidemenu'
                            ,id: 'modx-'+this.ident+'-hidemenu'
                            ,inputValue: 1
                            ,checked: MODx.config.hidemenu_default == '1' ? 1 : 0
                        },{
                            xtype: 'xcheckbox'
                            ,boxLabel: _('resource_published')
                            ,description: '<b>[[*published]]</b><br />'+_('resource_published_help')
                            ,hideLabel: true
                            ,name: 'published'
                            ,id: 'modx-'+this.ident+'-published'
                            ,inputValue: 1
                            ,checked: MODx.config.publish_default == '1' ? 1 : 0
                        },{
                            xtype: 'xcheckbox'
                            ,boxLabel: _('deleted')
                            ,description: '<b>[[*deleted]]</b><br />'+_('resource_delete')
                            ,hideLabel: true
                            ,name: 'deleted'
                            ,id: 'modx-'+this.ident+'-deleted'
                            ,inputValue: 1
                            ,checked: MODx.config.deleted_default == '1' ? 1 : 0
                        }]
                    }]
                },MODx.getQRContentField(this.ident,config.record.class_key)]
            },{
                id: 'modx-'+this.ident+'-settings'
                ,title: _('settings')
                ,layout: 'form'
                ,cls: 'modx-panel'
                ,autoHeight: true
                ,forceLayout: true
                ,labelWidth: 100
                ,defaults: {
                    autoHeight: true
                    ,border: false
                }
                ,items: MODx.getQRSettings(this.ident,config.record)
            }]
        }]
        ,keys: [{
            key: Ext.EventObject.ENTER
            ,shift: true
            ,fn: this.submit
            ,scope: this
        }]
    });
    MODx.window.QuickCreateResource.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.QuickCreateResource,MODx.Window);
Ext.reg('modx-window-quick-create-modResource',MODx.window.QuickCreateResource);

MODx.window.QuickUpdateResource = function(config) {
    config = config || {};
    this.ident = config.ident || 'qur'+Ext.id();
    Ext.applyIf(config,{
        title: _('quick_update_resource')
        ,id: this.ident
        ,action: 'Resource/Update'
        ,buttons: [{
            text: config.cancelBtnText || _('cancel')
            ,scope: this
            ,handler: function() { this.hide(); }
        },{
            text: config.saveBtnText || _('save')
            ,scope: this
            ,handler: function() { this.submit(false); }
        },{
            text: config.saveBtnText || _('save_and_close')
            ,cls: 'primary-button'
            ,scope: this
            ,handler: this.submit
        }]
    });
    MODx.window.QuickUpdateResource.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.QuickUpdateResource,MODx.window.QuickCreateResource);
Ext.reg('modx-window-quick-update-modResource',MODx.window.QuickUpdateResource);


MODx.getQRContentField = function(id,cls) {
    id = id || 'qur';
    cls = cls || 'MODX\\Revolution\\modDocument';
    var dm = Ext.getBody().getViewSize();
    var o = {};
    switch (cls) {
        case 'MODX\\Revolution\\modSymLink':
            o = {
                xtype: 'textfield'
                ,fieldLabel: _('symlink')
                ,name: 'content'
                ,id: 'modx-'+id+'-content'
                ,anchor: '100%'
                ,maxLength: 255
            };
            break;
        case 'MODX\\Revolution\\modWebLink':
            o = {
                xtype: 'textfield'
                ,fieldLabel: _('weblink')
                ,name: 'content'
                ,id: 'modx-'+id+'-content'
                ,anchor: '100%'
                ,maxLength: 255
                ,value: ''
            };
            break;
        case 'MODX\\Revolution\\modStaticResource':
            o = {
                xtype: 'modx-combo-browser'
                ,browserEl: 'modx-browser'
                ,prependPath: false
                ,prependUrl: false
                ,fieldLabel: _('static_resource')
                ,name: 'content'
                ,id: 'modx-'+id+'-content'
                ,anchor: '100%'
                ,maxLength: 255
                ,value: ''
                ,listeners: {
                    'select':{fn:function(data) {
                        if (data.url.substring(0,1) == '/') {
                            Ext.getCmp('modx-'+id+'-content').setValue(data.url.substring(1));
                        }
                    },scope:this}
                }
            };
            break;
        case 'MODX\\Revolution\\modResource':
        case 'MODX\\Revolution\\modDocument':
        default:
            o = {
                xtype: 'textarea'
                ,name: 'content'
                ,id: 'modx-'+id+'-content'
                ,fieldLabel: _('content')
                ,labelSeparator: ''
                ,anchor: '100%'
                ,style: 'min-height: 200px'
                ,grow: true
            };
            break;
    }
    return o;
};

MODx.getQRSettings = function(id,va) {
    id = id || 'qur';
    return [{
        layout: 'column'
        ,border: false
        ,anchor: '100%'
        ,defaults: {
            labelSeparator: ''
            ,labelAlign: 'top'
            ,border: false
            ,layout: 'form'
        }
        ,items: [{
            columnWidth: .5
            ,items: [{
                xtype: 'hidden'
                ,name: 'parent'
                ,id: 'modx-'+id+'-parent'
                ,value: va['parent']
            },{
                xtype: 'hidden'
                ,name: 'context_key'
                ,id: 'modx-'+id+'-context_key'
                ,value: va['context_key']
            },{
                xtype: 'hidden'
                ,name: 'class_key'
                ,id: 'modx-'+id+'-class_key'
                ,value: va['class_key']
            },{
                xtype: 'hidden'
                ,name: 'publishedon'
                ,id: 'modx-'+id+'-publishedon'
                ,value: va['publishedon']
            },{
                xtype: 'modx-field-parent-change'
                ,fieldLabel: _('resource_parent')
                ,description: '<b>[[*parent]]</b><br />'+_('resource_parent_help')
                ,name: 'parent-cmb'
                ,id: 'modx-'+id+'-parent-change'
                ,value: va['parent'] || 0
                ,anchor: '100%'
                ,parentcmp: 'modx-'+id+'-parent'
                ,contextcmp: 'modx-'+id+'-context_key'
                ,currentid: va['id'] || 0
            },{
                xtype: 'modx-combo-class-derivatives'
                ,fieldLabel: _('resource_type')
                ,description: '<b>[[*class_key]]</b><br />'
                ,name: 'class_key'
                ,hiddenName: 'class_key'
                ,id: 'modx-'+id+'-class-key'
                ,anchor: '100%'
                ,value: va['class_key'] != undefined ? va['class_key'] : 'MODX\\Revolution\\modDocument'
            },{
                xtype: 'modx-combo-content-type'
                ,fieldLabel: _('resource_content_type')
                ,description: '<b>[[*content_type]]</b><br />'+_('resource_content_type_help')
                ,name: 'content_type'
                ,hiddenName: 'content_type'
                ,id: 'modx-'+id+'-type'
                ,anchor: '100%'
                ,value: va['content_type'] != undefined ? va['content_type'] : (MODx.config.default_content_type || 1)

            },{
                xtype: 'modx-combo-content-disposition'
                ,fieldLabel: _('resource_contentdispo')
                ,description: '<b>[[*content_dispo]]</b><br />'+_('resource_contentdispo_help')
                ,name: 'content_dispo'
                ,hiddenName: 'content_dispo'
                ,id: 'modx-'+id+'-dispo'
                ,anchor: '100%'
                ,value: va['content_dispo'] != undefined ? va['content_dispo'] : 0
            },{
                xtype: 'numberfield'
                ,fieldLabel: _('resource_menuindex')
                ,description: '<b>[[*menuindex]]</b><br />'+_('resource_menuindex_help')
                ,name: 'menuindex'
                ,id: 'modx-'+id+'-menuindex'
                ,width: 75
                ,value: va['menuindex'] || 0
            }]
        },{
            columnWidth: .5
            ,items: [{
                xtype: 'xdatetime'
                ,fieldLabel: _('resource_publishedon')
                ,description: '<b>[[*publishedon]]</b><br />'+_('resource_publishedon_help')
                ,name: 'publishedon'
                ,id: 'modx-'+id+'-publishedon'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,startDay: parseInt(MODx.config.manager_week_start)
                ,dateWidth: 153
                ,timeWidth: 153
                ,offset_time: MODx.config.server_offset_time
                ,value: va['publishedon']
            },{
                xtype: va['canpublish'] ? 'xdatetime' : 'hidden'
                ,fieldLabel: _('resource_publishdate')
                ,description: '<b>[[*pub_date]]</b><br />'+_('resource_publishdate_help')
                ,name: 'pub_date'
                ,id: 'modx-'+id+'-pub-date'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,startDay: parseInt(MODx.config.manager_week_start)
                ,dateWidth: 153
                ,timeWidth: 153
                ,offset_time: MODx.config.server_offset_time
                ,value: va['pub_date']
            },{
                xtype: va['canpublish'] ? 'xdatetime' : 'hidden'
                ,fieldLabel: _('resource_unpublishdate')
                ,description: '<b>[[*unpub_date]]</b><br />'+_('resource_unpublishdate_help')
                ,name: 'unpub_date'
                ,id: 'modx-'+id+'-unpub-date'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,startDay: parseInt(MODx.config.manager_week_start)
                ,dateWidth: 153
                ,timeWidth: 153
                ,offset_time: MODx.config.server_offset_time
                ,value: va['unpub_date']
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_folder')
                ,description: _('resource_folder_help')
                ,hideLabel: true
                ,name: 'isfolder'
                ,id: 'modx-'+id+'-isfolder'
                ,inputValue: 1
                ,checked: va['isfolder'] != undefined ? va['isfolder'] : false
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_show_in_tree')
                ,description: _('resource_show_in_tree_help')
                ,hideLabel: true
                ,name: 'show_in_tree'
                ,id: 'modx-'+id+'-show_in_tree'
                ,inputValue: 1
                ,checked: va['show_in_tree'] != undefined ? va['show_in_tree'] : 1
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_hide_children_in_tree')
                ,description: _('resource_hide_children_in_tree_help')
                ,hideLabel: true
                ,name: 'hide_children_in_tree'
                ,id: 'modx-'+id+'-hide_children_in_tree'
                ,inputValue: 1
                ,checked: va['hide_children_in_tree'] != undefined ? va['hide_children_in_tree'] : false
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_alias_visible')
                ,description: _('resource_alias_visible_help')
                ,hideLabel: true
                ,name: 'alias_visible'
                ,id: 'modx-'+id+'-alias-visible'
                ,inputValue: 1
                ,checked: va['alias_visible'] != undefined ? va['alias_visible'] : 1
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_uri_override')
                ,description: _('resource_uri_override_help')
                ,hideLabel: true
                ,name: 'uri_override'
                ,id: 'modx-'+id+'-uri-override'
                ,value: 1
                ,checked: parseInt(va['uri_override']) ? true : false
                ,listeners: {'check': {fn:MODx.handleFreezeUri}}
            },{
                xtype: 'textfield'
                ,fieldLabel: _('resource_uri')
                ,description: '<b>[[*uri]]</b><br />'+_('resource_uri_help')
                ,name: 'uri'
                ,id: 'modx-'+id+'-uri'
                ,maxLength: 255
                ,anchor: '100%'
                ,value: va['uri'] || ''
                ,hidden: !va['uri_override']
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_richtext')
                ,description: _('resource_richtext_help')
                ,hideLabel: true
                ,name: 'richtext'
                ,id: 'modx-'+id+'-richtext'
                ,inputValue: 1
                ,checked: va['richtext'] !== undefined ? (va['richtext'] ? 1 : 0) : (MODx.config.richtext_default == '1' ? 1 : 0)
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_searchable')
                ,description: _('resource_searchable_help')
                ,hideLabel: true
                ,name: 'searchable'
                ,id: 'modx-'+id+'-searchable'
                ,inputValue: 1
                ,checked: va['searchable'] !== undefined ? (va['searchable'] ? 1 : 0) : (MODx.config.search_default == '1' ? 1 : 0)
                ,listeners: {'check': {fn:MODx.handleQUCB}}
            },{
                xtype: 'xcheckbox'
                ,boxLabel: _('resource_cacheable')
                ,description: _('resource_cacheable_help')
                ,hideLabel: true
                ,name: 'cacheable'
                ,id: 'modx-'+id+'-cacheable'
                ,inputValue: 1
                ,checked: va['cacheable'] !== undefined ? (va['cacheable'] ? 1 : 0) : (MODx.config.cache_default == '1' ? 1 : 0)
            },{
                xtype: 'xcheckbox'
                ,name: 'clearCache'
                ,id: 'modx-'+id+'-clearcache'
                ,boxLabel: _('resource_syncsite')
                ,description: _('resource_syncsite_help')
                ,hideLabel: true
                ,inputValue: 1
                ,checked: va['clearCache'] !== undefined ? (va['clearCache'] ? 1 : 0) : (MODx.config.syncsite_default == '1' ? 1 : 0)
            }]
        }]
    }];
};

MODx.handleQUCB = function(cb) {
    var h = Ext.getCmp(cb.id+'-hd');
    if (cb.checked && h) {
        cb.setValue(1);
        h.setValue(1);
    } else if (h) {
        cb.setValue(0);
        h.setValue(0);
    }
};

MODx.handleFreezeUri = function(cb) {
    var uri = Ext.getCmp(cb.id.replace('-override', ''));
    if (!uri) { return false; }
    if (cb.checked) {
        uri.show();
    } else {
        uri.hide();
    }
};

Ext.override(Ext.tree.AsyncTreeNode,{

    listeners: {
        click: {fn: function(){
            console.log('Clicked me!',arguments);
            return false;
        },scope: this}
    }
});
