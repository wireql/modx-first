Ext.namespace('MODx.grid');

MODx.grid.Grid = function(config = {}) {
    this.config = config;
    this._loadStore();
    this._loadColumnModel();

    Ext.applyIf(config,{
        store: this.store
        ,cm: this.cm
        ,sm: new Ext.grid.RowSelectionModel({singleSelect:true})
        ,paging: (config.bbar ? true : false)
        ,loadMask: true
        ,autoHeight: true
        ,collapsible: true
        ,stripeRows: true
        ,header: false
        ,cls: 'modx-grid'
        ,preventRender: true
        ,preventSaveRefresh: true
        ,showPerPage: true
        ,stateful: false
        ,showActionsColumn: true
        ,disableContextMenuAction: false
        ,menuConfig: {
            defaultAlign: 'tl-b?'
            ,enableScrolling: false
        }
        ,viewConfig: {
            forceFit: true
            ,enableRowBody: true
            ,autoFill: true
            ,showPreview: true
            ,scrollOffset: 0
            ,emptyText: config.emptyText || _('ext_emptymsg')
        }
        ,groupingConfig: {
            enableGroupingMenu: true
        }
    });
    if (config.paging) {
        var pgItms = config.showPerPage ? [_('per_page')+':',{
            xtype: 'textfield'
            ,cls: 'x-tbar-page-size'
            ,value: config.pageSize || (parseInt(MODx.config.default_per_page) || 20)
            ,listeners: {
                'change': {fn:this.onChangePerPage,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: this.blur
                        ,scope: cmp
                    });
                },scope:this}
            }
        }] : [];
        if (config.pagingItems) {
            for (var i=0;i<config.pagingItems.length;i++) {
                pgItms.push(config.pagingItems[i]);
            }
        }
        Ext.applyIf(config,{
            bbar: new Ext.PagingToolbar({
                pageSize: config.pageSize || (parseInt(MODx.config.default_per_page) || 20)
                ,store: this.getStore()
                ,displayInfo: true
                ,items: pgItms
            })
        });
    }
    if (config.grouping) {
        var groupingConfig = {
            forceFit: true
            ,scrollOffset: 0
            ,groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'
                + (config.pluralText || _('records')) + '" : "'
                + (config.singleText || _('record')) + '"]})'
        };

        Ext.applyIf(config.groupingConfig, groupingConfig);
        Ext.applyIf(config,{
            view: new Ext.grid.GroupingView(config.groupingConfig)
        });
    }
    if (config.tbar) {
        for (var ix = 0;ix<config.tbar.length;ix++) {
            var itm = config.tbar[ix];
            if (itm.handler && typeof(itm.handler) == 'object' && itm.handler.xtype) {
                itm.handler = this.loadWindow.createDelegate(this,[itm.handler],true);
            }
            if (!itm.scope) { itm.scope = this; }
        }
    }

    if (config.showActionsColumn) {
        var defaultActionsColumnWidth = 50;

        var isPercentage = function(columns) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].width && (columns[i].width > 1)) {
                    return false;
                }
            }

            return true;
        };

        if (config.columns && Array.isArray(config.columns)) {
            if (config.actionsColumnWidth === undefined) {
                if (isPercentage(config.columns)) {
                    defaultActionsColumnWidth = 0.1;
                }
            }

            config.columns.push({
                id: 'modx-actions'
                ,width: config.actionsColumnWidth || defaultActionsColumnWidth
                ,menuDisabled: true
                ,renderer: this.actionsColumnRenderer.bind(this)
            });
        }

        if (config.cm && config.cm.columns && Array.isArray(config.cm.columns)) {
            if (config.actionsColumnWidth === undefined) {
                if (isPercentage(config.cm.columns)) {
                    defaultActionsColumnWidth = 0.1;
                }
            }

            config.cm.columns.push({
                id: 'modx-actions'
                ,width: config.actionsColumnWidth || defaultActionsColumnWidth
                ,menuDisabled: true
                ,renderer: this.actionsColumnRenderer.bind(this)
            });
        }
    }

    MODx.grid.Grid.superclass.constructor.call(this,config);
    this._loadMenu(config);
    this.addEvents('beforeRemoveRow','afterRemoveRow','afterAutoSave');
    if (this.autosave) {
        this.on('afterAutoSave', this.onAfterAutoSave, this);
    }
    if (!config.preventRender) { this.render(); }
    this.on({
        render: {
            fn: function() {
                const topToolbar = this.getTopToolbar();
                if (topToolbar && topToolbar.initialConfig.cls && topToolbar.initialConfig.cls == 'has-nested-filters') {
                    this.hasNestedFilters = true;
                }
            },
            scope: this
        },
        rowcontextmenu: {
            fn: this._showMenu,
            scope: this
        }
    });
    if (config.autosave) {
        this.on('afteredit',this.saveRecord,this);
    }

    if (config.paging && config.grouping) {
        this.getBottomToolbar().bind(this.store);
    }

    if (!config.paging && !config.hasOwnProperty('pageSize')) {
        config.pageSize = 0;
    }

    this.getStore().load({
        params: {
            start: config.pageStart || 0
            ,limit: config.hasOwnProperty('pageSize') ? config.pageSize : (parseInt(MODx.config.default_per_page) || 20)
        }
    });
    this.getStore().on('exception',this.onStoreException,this);
    this.config = config;

    this.on('click', this.onClickHandler, this);
};
Ext.extend(MODx.grid.Grid,Ext.grid.EditorGridPanel,{
    windows: {}

    ,onStoreException: function(dataProxy, type, action, options, response) {
        const responseStatusCode = response.status || 'Unknown',
              responseStatusText = !Ext.isEmpty(response.statusText) ? `(${response.statusText})` : ''
        ;
        let output = '',
            msg = ''
        ;
        if (Ext.isEmpty(response.responseText)) {
            // When php display_error is off, responseText will likely be empty and only general status info will be available
            output = responseStatusCode !== 200 ? `<div class="error-status-info">${responseStatusCode} ${responseStatusText}</div>` : '';
        } else {
            // When php display_error is on OR the error is caught and explicity sent from the MODx class triggering the error, responseText should contain error text or possibly an object containing message text
            try {
                const responseText = Ext.decode(response.responseText);
                // In what scenario will responseText be an object with a message property?
                if (responseText && responseText.message) {
                    output = responseText.message;
                }
            } catch (e) {
                output = response.responseText;
            }
        }
        if (output) {
            if (MODx.config.debug > 0) {
                output = MODx.util.safeHtml(output, '<table><tbody><tr><th><td><div><i><em><b><strong>', 'class,colspan,rowspan');
                msg = _('error_grid_get_content_toscreen', {
                    message: `<pre><code>${output}</code></pre>`
                });
            } else {
                msg = _('error_grid_get_content_tolog');
                output = Ext.util.Format.stripTags(output).replaceAll('&gt;', '>').replaceAll('&lt;', '<');
                console.error(output);
            }
        } else {
            // With some scenarios, such as when php display_errors = 1 and MODx system setting debug = 0 (reporting off), the reponseText will be empty and the status will be 200
            msg = _('error_grid_get_content_no_msg');
        }
        this.getView().emptyText = `<div class="error-with-icon">${msg}</div>`;
        this.getView().refresh(false);
    }

    ,saveRecord: function(e) {
        e.record.data.menu = null;
        var p = this.config.saveParams || {};
        Ext.apply(e.record.data,p);
        var d = Ext.util.JSON.encode(e.record.data);
        var url = this.config.saveUrl || (this.config.url || this.config.connector);
        MODx.Ajax.request({
            url: url
            ,params: {
                action: this.config.save_action || 'updateFromGrid'
                ,data: d
            }
            ,listeners: {
                success: {
                    fn: function(r) {
                        if (this.config.save_callback) {
                            Ext.callback(this.config.save_callback,this.config.scope || this,[r]);
                        }
                        e.record.commit();
                        if (!this.config.preventSaveRefresh) {
                            const gridRefresh = new Ext.util.DelayedTask(() => this.refresh());
                            gridRefresh.delay(200);
                        }
                        this.fireEvent('afterAutoSave',r);
                    }
                    ,scope: this
                }
                ,failure: {
                    fn: function(r) {
                        e.record.reject();
                        this.fireEvent('afterAutoSave', r);
                    }
                    ,scope: this
                }
            }
        });
    }

    /**
     * Method executed after a record has been edited/saved inline from within the grid
     *
     * @param {Object} response - The processor save response object. See modConnectorResponse::outputContent (PHP)
     */
    ,onAfterAutoSave: function(response) {
        if (!response.success && response.message === '') {
            var msg = '';
            if (response.data.length) {
                // We get some data for specific field(s) error but not regular error message
                Ext.each(response.data, function(data, index, list) {
                    msg += (msg != '' ? '<br/>' : '') + data.msg;
                }, this);
            }
            if (Ext.isEmpty(msg)) {
                // Still no valid message so far, let's use some fallback
                msg = this.autosaveErrorMsg || _('error');
            }
            MODx.msg.alert(_('error'), msg);
        }
    }

    ,onChangePerPage: function(tf,nv) {
        if (Ext.isEmpty(nv)) return false;
        nv = parseInt(nv);
        this.getBottomToolbar().pageSize = nv;
        this.store.load({params:{
            start:0
            ,limit: nv
        }});
    }

    ,loadWindow: function(btn,e,win,or) {
        var r = this.menu.record;
        if (!this.windows[win.xtype] || win.force) {
            Ext.applyIf(win,{
                record: win.blankValues ? {} : r
                ,grid: this
                ,listeners: {
                    'success': {fn:win.success || this.refresh,scope:win.scope || this}
                }
            });
            if (or) {
                Ext.apply(win,or);
            }
            this.windows[win.xtype] = Ext.ComponentMgr.create(win);
        }
        if (this.windows[win.xtype].setValues && win.blankValues !== true && r != undefined) {
            this.windows[win.xtype].setValues(r);
        }
        this.windows[win.xtype].show(e.target);
    }

    ,confirm: function(type,text) {
        var p = { action: type };
        var k = this.config.primaryKey || 'id';
        p[k] = this.menu.record[k];

        MODx.msg.confirm({
            title: _(type)
            ,text: _(text) || _('confirm_remove')
            ,url: this.config.url
            ,params: p
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }

    ,remove: function(text, action) {
        if (this.destroying) {
            return MODx.grid.Grid.superclass.remove.apply(this, arguments);
        }
        var r = this.menu.record;
        text = text || 'confirm_remove';
        var p = this.config.saveParams || {};
        Ext.apply(p,{ action: action || 'remove' });
        var k = this.config.primaryKey || 'id';
        p[k] = r[k];

        if (this.fireEvent('beforeRemoveRow',r)) {
            MODx.msg.confirm({
                title: _('warning')
                ,text: _(text, r)
                ,url: this.config.url
                ,params: p
                ,listeners: {
                    'success': {fn:function() {
                        this.removeActiveRow(r);
                    },scope:this}
                }
            });
        }
    }

    ,removeActiveRow: function(r) {
        if (this.fireEvent('afterRemoveRow',r)) {
            var rx = this.getSelectionModel().getSelected();
            this.getStore().remove(rx);
        }
    }

    ,_loadMenu: function() {
        this.menu = new Ext.menu.Menu(this.config.menuConfig);
    }

    ,_showMenu: function(g,ri,e) {
        e.stopEvent();
        e.preventDefault();
        this.menu.record = this.getStore().getAt(ri).data;
        if (!this.getSelectionModel().isSelected(ri)) {
            this.getSelectionModel().selectRow(ri);
        }
        this.menu.removeAll();
        if (this.getMenu) {
            var m = this.getMenu(g,ri,e);
            if (m && m.length && m.length > 0) {
                this.addContextMenuItem(m);
            }
        }
        if ((!m || m.length <= 0) && this.menu.record.menu) {
            this.addContextMenuItem(this.menu.record.menu);
        }
        if (this.menu.items.length > 0) {
            this.menu.showAt(e.xy);
        }
    }

    ,_loadStore: function() {
        if (this.config.grouping) {
            this.store = new Ext.data.GroupingStore({
                url: this.config.url
                ,baseParams: this.config.baseParams || { action: this.config.action || 'getList'}
                ,reader: new Ext.data.JsonReader({
                    totalProperty: 'total'
                    ,root: 'results'
                    ,fields: this.config.fields
                })
                ,sortInfo:{
                    field: this.config.sortBy || 'id'
                    ,direction: this.config.sortDir || 'ASC'
                }
                ,remoteSort: this.config.remoteSort || false
                ,remoteGroup: this.config.remoteGroup || false
                ,groupField: this.config.groupBy || 'name'
                ,groupDir: this.config.groupDir || 'ASC'
                ,storeId: this.config.storeId || Ext.id()
                ,autoDestroy: true
                ,listeners: {
                    beforeload: function(store, options) {
                        const changedGroupDir = store.groupField === store.sortInfo.field && store.groupDir !== store.sortInfo.direction;
                        if (changedGroupDir) {
                            store.groupDir = store.sortInfo.direction;
                            store.baseParams.groupDir = store.sortInfo.direction;
                        }
                    },
                    load: function(store, records, options) {
                        const cmp = Ext.getCmp('modx-content');
                        if (cmp) {
                            cmp.doLayout();
                        }
                    },
                    groupchange: {
                        fn: function(store, groupField) {
                            store.groupDir = this.config.groupDir || 'ASC';
                            store.baseParams.groupDir = store.groupDir;
                            store.sortInfo.direction = this.config.sortDir || 'ASC';
                            store.load();
                        },
                        scope: this
                    }
                }
            });
        } else {
            this.store = new Ext.data.JsonStore({
                url: this.config.url
                ,baseParams: this.config.baseParams || { action: this.config.action || 'getList' }
                ,fields: this.config.fields
                ,root: 'results'
                ,totalProperty: 'total'
                ,remoteSort: this.config.remoteSort || false
                ,storeId: this.config.storeId || Ext.id()
                ,autoDestroy: true
                ,listeners:{
                    load: function() {
                        const cmp = Ext.getCmp('modx-content');
                        if (cmp) {
                            cmp.doLayout();
                        }
                    }
                }
            });
        }
    }

    ,_loadColumnModel: function() {
        if (this.config.columns) {
            var c = this.config.columns;
            for (var i=0;i<c.length;i++) {
                // if specifying custom editor/renderer
                if (typeof(c[i].editor) == 'string') {
                    c[i].editor = eval(c[i].editor);
                }
                if (typeof(c[i].renderer) == 'string') {
                    c[i].renderer = eval(c[i].renderer);
                }
                if (typeof(c[i].editor) == 'object' && c[i].editor.xtype) {
                    var r = c[i].editor.renderer;
                    if (Ext.isEmpty(c[i].editor.id)) { c[i].editor.id = Ext.id(); }
                    c[i].editor = Ext.ComponentMgr.create(c[i].editor);
                    if (r === true) {
                        if (c[i].editor && c[i].editor.store && !c[i].editor.store.isLoaded && c[i].editor.config.mode != 'local') {
                            c[i].editor.store.load();
                            c[i].editor.store.isLoaded = true;
                        }
                        c[i].renderer = Ext.util.Format.comboRenderer(c[i].editor);
                    } else if (c[i].editor.initialConfig.xtype === 'datefield') {
                        c[i].renderer = Ext.util.Format.dateRenderer(c[i].editor.initialConfig.format || 'Y-m-d');
                    } else if (r === 'boolean') {
                        c[i].renderer = this.rendYesNo;
                    } else if (r === 'password') {
                        c[i].renderer = this.rendPassword;
                    } else if (r === 'local' && typeof(c[i].renderer) == 'string') {
                        c[i].renderer = eval(c[i].renderer);
                    }
                }

                /**
                 * When no renderer is provided, automatically apply the htmlEncode renderer to protect
                 * against XSS vulnerabilities. Columns that do have a renderer applied are assumed to
                 * implement their own protection.
                 */
                if (Ext.isEmpty(c[i].renderer)) {
                    c[i].renderer = Ext.util.Format.htmlEncode;
                }

                /**
                 * When the field has an editor defined, wrap the (optional) renderer with
                 * a special renderer that applies a class and tooltip to indicate the
                 * column is editable.
                 */
                if (c[i].editor) {
                    c[i].renderer = this.renderEditableColumn(c[i].renderer);
                }
            }
            this.cm = new Ext.grid.ColumnModel(c);
        }
    }

    ,addContextMenuItem: function(items) {
        var l = items.length;
        for(var i = 0; i < l; i++) {
            var options = items[i];

            if (options == '-') {
                this.menu.add('-');
                continue;
            }
            var h = Ext.emptyFn;
            if (options.handler) {
                h = eval(options.handler);
                if (h && typeof(h) == 'object' && h.xtype) {
                    h = this.loadWindow.createDelegate(this,[h],true);
                }
            } else {
                h = function(itm) {
                    var o = itm.options;
                    var id = this.menu.record.id;
                    if (o.confirm) {
                        Ext.Msg.confirm('',o.confirm,function(e) {
                            if (e == 'yes') {
                                var act = Ext.urlEncode(o.params || {action: o.action});
                                location.href = '?id='+id+'&'+act;
                            }
                        },this);
                    } else {
                        var act = Ext.urlEncode(o.params || {action: o.action});
                        location.href = '?id='+id+'&'+act;
                    }
                };
            }
            this.menu.add({
                id: options.id || Ext.id()
                ,text: options.text
                ,scope: options.scope || this
                ,options: options
                ,handler: h
            });
        }
    }

    ,refresh: function() {
        this.getStore().reload();
    }

    ,rendPassword: function(v) {
        var z = '';
        for (var i=0;i<v.length;i++) {
            z = z+'*';
        }
        return z;
    }

    ,renderEditableColumn: function(renderer) {
        return function(value, metaData, record, rowIndex, colIndex, store) {
            if (renderer) {
                if (typeof renderer.fn === 'function') {
                    var scope = (renderer.scope) ? renderer.scope : false;
                    renderer = renderer.fn.bind(scope);
                }

                if (typeof renderer === 'function') {
                    value = renderer(value, metaData, record, rowIndex, colIndex, store);
                }
            }
            metaData.css = ['x-editable-column', metaData.css || ''].join(' ');

            return value;
        }
    }

    ,rendYesNo: function(v,md) {
        if (v === 1 || v == '1') { v = true; }
        if (v === 0 || v == '0') { v = false; }
        switch (v) {
            case true:
            case 'true':
            case 1:
                md.css = 'green';
                return _('yes');
            case false:
            case 'false':
            case '':
            case 0:
                md.css = 'red';
                return _('no');
            // no default
        }
    }

    ,getSelectedAsList: function() {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i=0;i<sels.length;i++) {
            cs += ','+sels[i].data[this.config.primaryKey || 'id'];
        }

        if (cs[0] == ',') {
            cs = cs.substr(1);
        }
        return cs;
    }

    ,editorYesNo: function(r) {
        r = r || {};
        Ext.applyIf(r,{
            store: new Ext.data.SimpleStore({
                fields: ['d','v']
                ,data: [[_('yes'),true],[_('no'),false]]
            })
            ,displayField: 'd'
            ,valueField: 'v'
            ,mode: 'local'
            ,triggerAction: 'all'
            ,editable: false
            ,selectOnFocus: false
        });
        return new Ext.form.ComboBox(r);
    }

    ,encodeModified: function() {
        var p = this.getStore().getModifiedRecords();
        var rs = {};
        for (var i=0;i<p.length;i++) {
            rs[p[i].data[this.config.primaryKey || 'id']] = p[i].data;
        }
        return Ext.encode(rs);
    }

    ,encode: function() {
        var p = this.getStore().getRange();
        var rs = {};
        for (var i=0;i<p.length;i++) {
            rs[p[i].data[this.config.primaryKey || 'id']] = p[i].data;
        }
        return Ext.encode(rs);
    }

    ,expandAll: function() {

        var expander = this.findExpanderPlugin(this.config.plugins);

        if (!expander) {
            return false;
        }

        var rows = this.getView().getRows();

        for (var i = 0; i < rows.length; i++) {
            expander.expandRow(rows[i]);
        }

        if (this.tools['plus'] !== undefined) {
            this.tools['plus'].hide();
        }

        if (this.tools['minus'] !== undefined) {
            this.tools['minus'].show();
        }

        return true;
    }

    ,collapseAll: function() {

        var expander = this.findExpanderPlugin(this.config.plugins);

        if (!expander) {
            return false;
        }

        var rows = this.getView().getRows();

        for (var i = 0; i < rows.length; i++) {
            expander.collapseRow(rows[i]);
        }

        if (this.tools['minus'] !== undefined) {
            this.tools['minus'].hide();
        }

        if (this.tools['plus'] !== undefined) {
            this.tools['plus'].show();
        }

        return true;
    }

    /**
     * Returns first found expander plugin
     * @param plugins
     */
    ,findExpanderPlugin: function (plugins) {

        if (Ext.isObject(plugins)) {
            plugins = [plugins];
        }

        var index = Ext.each(plugins, function (item) {
            if (item.id !== undefined && item.id === 'expander') {
                return false;
            }
        });

        return plugins[index];
    }

    ,_getActionsColumnTpl: function () {
        return new Ext.XTemplate('<tpl for=".">'
            + '<tpl if="actions !== null">'
            + '<ul class="x-grid-buttons">'
            + '<tpl for="actions">'
            + '<li><i class="x-grid-action icon icon-{icon:htmlEncode}" title="{text:htmlEncode}" data-action="{action:htmlEncode}"></i></li>'
            + '</tpl>'
            + '</ul>'
            + '</tpl>'
            + '</tpl>', {
            compiled: true
        });
    }

    ,actionsColumnRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        var actions = this.getActions.apply(this, [record, rowIndex, colIndex, store]);
        if (this.config.disableContextMenuAction !== true) {
            actions.push({
                text: _('context_menu'),
                action: 'contextMenu',
                icon: 'gear'
            });
        }

        return this._getActionsColumnTpl().apply({
            actions: actions
        });
    }

    ,renderLink: function(v,attr) {
        var el = new Ext.Element(document.createElement('a'));
        el.addClass('x-grid-link');
        el.dom.title = _('edit');
        for (var i in attr) {
            el.dom[i] = attr[i];
        }
        el.dom.innerHTML = Ext.util.Format.htmlEncode(v);
        return el.dom.outerHTML;
    }

    /**
     * Deprecated; renamed checkCellIsEditable. Remove in 3.1
     */
    ,checkEditable: function(e) {
        this.checkCellIsEditable(e);
    }

    /**
     * Disables cell editor under specified conditions
     * @param {Object} e - Ext event object containing references to grid, record, field, value, row (index), column (index), and cancel (set true to cancel edit).
     * @return {Boolean} Return false to cancel or true to commit the edit
     */
    ,checkCellIsEditable: function(e) {
        const permissions = e.record.data.perm || '';
        if (permissions.indexOf('edit') === -1) {
            return false;
        }
        // Grid-specific conditions
        switch (e.grid.xtype) {
            case 'modx-grid-role': {
                const
                    isAuthorityField = e.field === 'authority',
                    roleIsAssigned = e.record.json.isAssigned
                ;
                if (roleIsAssigned && isAuthorityField) {
                    return false;
                }
                break;
            }
            default:
        }
        return true;
    }

    /**
     * Add one or more classes to a specific Editor Grid cell, typically to indicate a level of restriction
     * 
     * @param {Object} record - The row's data record
     * @param {Array} lockConditions - A set of one or more Boolean values (or ones that cast correctly to the expected Boolean value) derived from the row record or other values that indicate whether or not the subject cell should be marked as locked
     * @param {String} lockedClasses - One or more css class names
     * @param {Boolean} conditionsRequireAll - Whether all passed lockConditions need to evaluate to true to apply the locked class(es)
     */
    ,setEditableCellClasses: function(record, lockConditions = [], lockedClasses = 'locked', conditionsRequireAll = true) {
        const
            permissions = record.data.perm.trim(),
            hasEditPermission = permissions.split(' ').includes('edit')
        ;
        let
            classes = '',
            shouldLock = false
        ;
        if (lockConditions.length > 0) {
            shouldLock = conditionsRequireAll
                ? lockConditions.every(condition => Boolean(condition) === true)
                : lockConditions.some(condition => Boolean(condition) === true)
            ;
        }
        if (Ext.isEmpty(permissions)) {
            classes = 'editor-disabled';
        } else if (hasEditPermission && shouldLock) {
            classes = lockedClasses;
        }
        return classes;
    }

    /**
     * @property {Function} getLinkTemplate - Adds a link on a grid column's value based on the passed params.
     * Usage of this method is necessary for grouping grids, where usage of renderers on its column model
     * interfere with the grouping functionality.
     *
     * @param {String} controllerPath - The initial part of the URL query indicating the controller action
     * @param {String} displayValueIndex - The data index used as the link's text
     * @param {Object} options - Additional URL query parameters (linkParams) and attributes for the link's anchor tag
     * @return {Ext.Template}
     */
    ,getLinkTemplate: function(controllerPath, displayValueIndex, options = {}) {
        /*
            linkParams, if given, should be an array of objects in the following format:
            [{ key: 'paramKey', valueIndex: 'paramValue' }, ...{}]
        */
        Ext.applyIf(options, {
            linkParams: [],
            linkClass: 'x-grid-link',
            linkTitle: _('edit'),
            linkTarget: '_blank'
        });
        let params = '';
        controllerPath = controllerPath.indexOf('?a=') === 0 ? controllerPath : `?a=${controllerPath}` ;
        if (options.linkParams.length > 0) {
            params = [];
            options.linkParams.forEach(param => {
                params.push(`${param.key}={${param.valueIndex}}`);
            });
            params = `&${params.join('&')}`;
        }
        return new Ext.Template(
            `<tpl><a href="${controllerPath}${params}" class="${options.linkClass}" title="${options.linkTitle}" target="${options.linkTarget}">{${displayValueIndex}:htmlEncode}</a></tpl>`,
            { compiled: true }
        );
    }

    ,getActions: function(record, rowIndex, colIndex, store) {
        return [];
    }

    ,onClickHandler: function(e) {
        var target = e.getTarget();
        if (!target.classList.contains('x-grid-action')) return;
        if (!target.dataset.action) return;

        var actionHandler = 'action' + target.dataset.action.charAt(0).toUpperCase() + target.dataset.action.slice(1);
        if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
            actionHandler = target.dataset.action;
            if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
                return;
            }
        }

        var record = this.getSelectionModel().getSelected();
        var recordIndex = this.store.indexOf(record);
        this.menu.record = record.data;

        this[actionHandler](record, recordIndex, e);
    }

    ,actionContextMenu: function(record, recordIndex, e) {
        this._showMenu(this, recordIndex, e);
    }

    ,makeUrl: function () {
        if (Array.isArray(this.config.urlFilters) && this.config.urlFilters.length > 0) {
            var s = this.getStore();
            var p = {
                a: MODx.request.a
            }
            if (MODx.request.id) {
                p['id'] = MODx.request.id;
            }
            if (MODx.request.key) {
                p['key'] = MODx.request.key;
            }
            for (var i = 0; i < this.config.urlFilters.length; ++i) {
                if (s.baseParams.hasOwnProperty(this.config.urlFilters[i]) && s.baseParams[this.config.urlFilters[i]]) {
                    if (this.config.urlFilters[i] === 'namespace') {
                        p['ns'] = s.baseParams[this.config.urlFilters[i]];
                    } else {
                        p[this.config.urlFilters[i]] = s.baseParams[this.config.urlFilters[i]];
                    }
                }
            }
            return Ext.urlAppend(MODx.config.manager_url, Ext.urlEncode(p).replace(/%2F/g, '/'));
        }
    }

    ,replaceState: function () {
        if (typeof window.history.replaceState !== 'undefined' &&
            Array.isArray(this.config.urlFilters) && this.config.urlFilters.length > 0
        ) {
            window.history.replaceState(this.getStore().baseParams, document.title, this.makeUrl());
        }
    }

    /**
     * @property {Function} findTabPanel - Recursively search ownerCts for this component's enclosing TabPanel
     *
     * @param {Object} referenceCmp - A child component of the TabPanel we're looking for
     * @return Ext.TabPanel
     */
    ,findTabPanel: function(referenceCmp) {
        if (!referenceCmp.hasOwnProperty('ownerCt')) {
            console.error('MODx.grid.Grid::findTabPanel: This component must have an ownerCt to find its tab panel.');
            return false;
        }
        const container = referenceCmp.ownerCt,
              isTabPanel = container.hasOwnProperty('xtype') && container.xtype.includes('tabs')
        ;
        if (isTabPanel) {
            return container;
        }
        return this.findTabPanel(container);
    }

    /**
     * @property {Boolean} hasNestedFilters - Indicates whether the top toolbar filter(s) are nested
     * within a secondary container; they will be nested when they have labels and those labels are
     * positioned above the filter's input.
     */
    ,hasNestedFilters: false

    ,currentLanguage: MODx.config.cultureKey || 'en' // removed MODx.request.language

    /**
     * Applies a value persisted via URL (MODx.request) for use in grid and filter params. Used when multiple
     * grids make use of the same data point, but the request value should apply to only one of them.
     * (Primary use-case is in the User Group Access Permissions area.)
     *
     * @param {Number} tabPanelIndex The zero-based index of the tab panel containing this grid
     * @param {String} requestKey The data point (policy, namespace, etc)
     * @param {String} tabPanelType The panel type this grid is a child of
     * @param {Boolean} setEmptyToString - For some components, like combos, setting to null is better
     * when no value is present. Set this to true for components that prefer an empty string
     * @returns {Number|String} Decoded param value
     */
    ,applyRequestFilter: function(tabPanelIndex, requestKey = 'policy', tabPanelType = 'vtab', setEmptyToString = false) {
        const emptyVal = setEmptyToString ? '' : null ;
        return Object.prototype.hasOwnProperty.call(MODx.request, tabPanelType)
            && parseInt(MODx.request[tabPanelType], 10) === tabPanelIndex
            && Object.prototype.hasOwnProperty.call(MODx.request, requestKey)
                ? MODx.util.url.getParamValue(requestKey)
                : emptyVal
        ;
    }

    /**
     * Filters the grid data by the passed filter component (field)
     *
     * @param {Object} cmp - The filter field's Ext.Component object
     * @param {String} param - The record index to apply the filter on;
     * may also be the general query/search field name.
     */
    ,applyGridFilter: function(cmp, param = 'query') {
        const filterValue = cmp.getValue(),
              store = this.getStore(),
              urlParams = {},
              tabPanel = this.findTabPanel(this),
              bottomToolbar = this.getBottomToolbar()
        ;
        let hasParentTabPanel = false,
            parentTabItems,
            activeParentTabIdx
        ;
        if (!Ext.isEmpty(filterValue)) {
            // Add param to URL when filter has a value
            urlParams[param] = filterValue;
        } else if (MODx.request[param]) {
            /*
                Maintain params in URL when already present in URL. Prevents removal of
                filter params when reloading or navigating to a URL that includes filter params.
            */
            urlParams[param] = MODx.request[param];
        } else {
            MODx.util.url.clearParam(cmp);
        }
        if (param == 'ns') {
            store.baseParams['namespace'] = filterValue;
        } else {
            store.baseParams[param] = filterValue;
        }
        if (tabPanel) {
            /*
                Determine if this is a vertical tab panel; if so there will also be a
                horizontal parent tab panel that needs to be accounted for
            */
            if (tabPanel.xtype == 'modx-vtabs') {
                const parentTabPanel = this.findTabPanel(tabPanel);
                if (parentTabPanel) {
                    const activeParentTab = parentTabPanel.getActiveTab();
                    hasParentTabPanel = true;
                    parentTabItems = parentTabPanel.items;
                    activeParentTabIdx = parentTabItems.indexOf(activeParentTab);
                }
            }
            const activeTab = tabPanel.getActiveTab(),
                  tabItems = tabPanel.items,
                  activeTabIdx = tabItems.indexOf(activeTab)
            ;
            // Only need to add tab index to the URL when there are multiple tabs
            if (hasParentTabPanel) {
                if (tabItems.length > 1) {
                    urlParams.vtab = activeTabIdx;
                }
                if (parentTabItems.length > 1) {
                    urlParams.tab = activeParentTabIdx;
                }
            } else {
                if (tabItems.length > 1) {
                    urlParams.tab = activeTabIdx;
                }
            }
        }
        store.load();
        MODx.util.url.setParams(urlParams)
        if (bottomToolbar) {
            bottomToolbar.changePage(1);
        }
    }

    /**
     * @property {Function} clearGridFilters - Clears all grid filters and sets them to their default value
     *
     * @param {String|Array} items - A comma-separated list (or array) of items to be cleared. An optional default value
     * may also be specified. The expected format for each item in the list is:
     * 'filter-category', where 'filter-category' matches the Ext component's itemId and 'category' is the record index to filter on OR
     * 'filter-category:3', where '3' is the filter's default value to be applied (instead of setting to an empty value)
     *
     */
    ,clearGridFilters: function(items) {
        const store = this.getStore(),
              bottomToolbar = this.getBottomToolbar(),
              data = Array.isArray(items) ? items : items.split(',')
        ;
        data.forEach(item => {
            const itemData = item.replace(/\s+/g, '').split(':'),
                  itemId = itemData[0],
                  itemDefaultVal = itemData.length == 2 ? itemData[1] : null ,
                  cmp = this.getFilterComponent(itemId),
                  param = MODx.util.url.getParamNameFromCmp(cmp),
                  isCombo = cmp?.xtype?.includes('combo')
            ;
            if (isCombo) {
                if (itemDefaultVal === '') {
                    cmp.setValue(null);
                } else {
                    cmp.setValue(itemDefaultVal);
                }
            } else {
                cmp.setValue('');
            }
            if (!Ext.isEmpty(itemDefaultVal)) {
                const paramsList = Object.keys(cmp.baseParams);
                paramsList.forEach(param => {
                    switch(param) {
                        case 'namespace':
                            cmp.baseParams[param] = 'core';
                            break;
                        case 'topic':
                            cmp.baseParams[param] = 'default';
                            break;
                    }
                });
            }
            if (isCombo) {
                if (cmp.mode !== 'local') {
                    cmp.getStore().load();
                }
            }
            store.baseParams[param] = itemDefaultVal;
        });
        store.load();
        MODx.util.url.clearAllParams();
        if (bottomToolbar) {
            bottomToolbar.changePage(1);
        }
    }

    /**
     * @property {Boolean} hasNestedFilters - Indicates whether the top toolbar filter(s) are nested
     * within a secondary container; they will be nested when they have labels and those labels are
     * positioned above the filter's input.
     */
    ,hasNestedFilters: false

    /**
     * @property {Function} getFilterComponent - Gets a filter component from the top toolbar by its itemId
     *
     * @param {String} filterId - The Ext itemId of the filter component to fetch
     * @return {Ext.Component}
     */
    ,getFilterComponent: function(filterId) {
        const topToolbar = this.getTopToolbar(),
              cmp = this.hasNestedFilters && filterId !== 'filter-query'
                ? topToolbar.find('itemId', `${filterId}-container`)[0].getComponent(filterId)
                : topToolbar.getComponent(filterId)
        ;
        if (typeof cmp !== 'undefined') {
            return cmp;
        }
        console.error(`getFilterComponent: The filter component with itemId '${filterId}' could not be retrieved.`);
    }

    /**
     * @property {Function} refreshFilterOptions - Used to syncronize a filter's store options to those available in its target grid
     *
     * @param {Array} filterData - An array of objects containing info needed to refresh each filter
     * @param {Boolean} clearDependentParams - If true, will clear values of dependentParams specified in the filterData
     */
    ,refreshFilterOptions: function(filterData = [], clearDependentParams = true) {
        if (filterData.length > 0) {
            filterData.forEach(data => {
                const filter = this.getFilterComponent(data.filterId);
                if (filter) {
                    const store = filter.getStore();
                    filter.setValue('');
                    if (store) {
                        if (data.hasOwnProperty('dependentParams')) {
                            const dependentParams = Array.isArray(data.dependentParams) ? data.dependentParams : data.dependentParams.split(',');
                            dependentParams.forEach(param => {
                                if (clearDependentParams && store.baseParams.hasOwnProperty(param)) {
                                    store.baseParams[param] = '';
                                }
                            });
                        }
                        store.load();
                    }
                }
            });
        this.refresh();
        }
    }

    /**
     * @property {Function} updateDependentFilter - Reloads a related filter's store based on the current filter's selected item
     *
     * @param {String} filterId - The Ext id of the filter to update
     * @param {String} paramKey - Filter baseParams property
     * @param {Mixed} paramValue - Filter baseParams value for the paramKey
     * @param {Boolean} clearValue - Set true to clear filter's selected value
     */
    ,updateDependentFilter: function(filterId, paramKey, paramValue, clearValue = false) {
        const filter = this.getFilterComponent(filterId),
              filterStore = filter ? filter.getStore() : null
        ;
        if (filterStore && typeof paramKey == 'string') {
            if (clearValue) {
                filter.setValue('');
            }
            filterStore.baseParams[paramKey] = paramValue;
            filterStore.load();
        }
    }

    /**
     * @property {Function} getQueryFilterField - Creates the query field component configuration
     *
     * @param {String} filterSpec - Optional, specifies a unique itemId and current request value to avoid conflicts when
     * multiple query fields are present in the same view (e.g., when multiple tabs have a grid with a query filter).
     * Format = 'id:value'
     * @param {String} implementation - Optional, an identifier used to assign grid-specific behavior
     * @return {Object}
     */
    ,getQueryFilterField: function(filterSpec = 'filter-query', implementation = 'default') {
        let queryValue = '';
        const
            filterSpecs = filterSpec.split(':'),
            filterId = filterSpecs[0].trim()
        ;
        if (filterSpecs.length === 2) {
            queryValue = filterSpecs[1];
        } else {
            queryValue = MODx.request.query ? MODx.util.url.decodeParamValue(MODx.request.query) : '' ;
        }
        return {
            xtype: 'textfield',
            itemId: filterId,
            emptyText: _('search'),
            value: queryValue,
            cls: 'filter-query',
            listeners: {
                change: {
                    fn: function(cmp, newValue, oldValue) {
                        this.applyGridFilter(cmp);
                        const usergroupTree = Ext.getCmp('modx-tree-usergroup')
                        if (implementation === 'user-group-users' && usergroupTree) {
                            /*
                                When the user group users grid is shown in the primary ACLs panel,
                                having the user groups tree along with a corresponding grid, the
                                group id must be fetched from the tree
                            */
                            const selectedNode = usergroupTree.getSelectionModel().getSelectedNode(),
                                  groupId = MODx.util.tree.getGroupIdFromNode(selectedNode)
                            ;
                            MODx.util.url.setParams({group: groupId});
                        }
                    },
                    scope: this
                },
                afterrender: {
                    fn: function(cmp) {
                        if (MODx.request.query) {
                            this.applyGridFilter(cmp);
                        }
                    },
                    scope: this
                },
                render: {
                    fn: function(cmp) {
                        new Ext.KeyMap(cmp.getEl(), {
                            key: Ext.EventObject.ENTER,
                            fn: this.blur,
                            scope: cmp
                        });
                    }
                    ,scope: this
                }
            }
        }
    }

    /**
     * @property {Function} getClearFiltersButton - Creates the clear filter button component configuration
     *
     * @param {String} filters - A comma-separated list of filter component ids (itemId) specifying those that should be cleared
     * @param {String} dependentFilterResets - Optional, specification for reset of dependent filter stores to their pre-filtered state
     * in the following format: 'filterItemId:relatedBaseParam, [filterItemId:relatedBaseParam,] ...'
     * @return {Object}
     */
    ,getClearFiltersButton: function(filters = 'filter-query', dependentFilterResets = null) {
        if (Ext.isEmpty(filters)) {
            console.error('MODx.grid.Grid::getClearFiltersButton: There was a problem creating the Clear Filter button because the supplied filters list is invalid.');
            return {};
        }
        const config = {
            text: _('filter_clear'),
            itemId: 'filter-clear',
            listeners: {
                click: {
                    fn: function(cmp) {
                        if (cmp.dependentResets) {
                            const resets = cmp.dependentResets.split(',');
                            resets.forEach(reset => {
                                const [filterId, filterDataIndex] = reset.split(':').map(item => item.trim());
                                this.updateDependentFilter(filterId, filterDataIndex, '', true);
                            });
                        }
                        this.clearGridFilters(filters);
                    },
                    scope: this
                },
                mouseout: {
                    fn: function(evt) {
                        this.removeClass('x-btn-focus');
                    }
                }
            }
        }
        if (dependentFilterResets) {
            config.dependentResets = dependentFilterResets;
        }
        return config;
    }

    /**
     * Get the request value for a grid's category filtering. Derives whether the category param is to be applied to a
     * grid and its category filter based on the existence of the tab param in the GET request. Needed where the same
     * category processor is used for different purposes within the same editing panel (notably the Template and TV panels).
     */
    ,getCategoryFilterValue: () => {
        if (typeof MODx.request.tab === 'undefined' || typeof MODx.request.category === 'undefined') {
            return null;
        }
        return Math.abs(parseInt(MODx.request.category, 10));
    }
});

/* local grid */
MODx.grid.LocalGrid = function(config) {
    config = config || {};

    if (config.grouping) {
        Ext.applyIf(config,{
            view: new Ext.grid.GroupingView({
                forceFit: true
                ,scrollOffset: 0
                ,hideGroupedColumn: config.hideGroupedColumn ? true : false
                ,groupTextTpl: config.groupTextTpl || ('{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'
                    +(config.pluralText || _('records')) + '" : "'
                    +(config.singleText || _('record'))+'"]})' )
            })
        });
    }
    if (config.tbar) {
        for (var i = 0;i<config.tbar.length;i++) {
            var itm = config.tbar[i];
            if (itm.handler && typeof(itm.handler) == 'object' && itm.handler.xtype) {
                itm.handler = this.loadWindow.createDelegate(this,[itm.handler],true);
            }
            if (!itm.scope) { itm.scope = this; }
        }
    }
    Ext.applyIf(config,{
        title: ''
        ,store: this._loadStore(config)
        ,sm: new Ext.grid.RowSelectionModel({singleSelect:false})
        ,loadMask: true
        ,collapsible: true
        ,stripeRows: true
        ,enableColumnMove: true
        ,header: false
        ,cls: 'modx-grid'
        ,showActionsColumn: true
        ,actionsColumnWidth: 50
        ,disableContextMenuAction: false
        ,viewConfig: {
            forceFit: true
            ,enableRowBody: true
            ,autoFill: true
            ,showPreview: true
            ,scrollOffset: 0
            ,emptyText: config.emptyText || _('ext_emptymsg')
        }
        ,menuConfig: { defaultAlign: 'tl-b?' ,enableScrolling: false }
    });

    this.menu = new Ext.menu.Menu(config.menuConfig);
    this.config = config;
    this._loadColumnModel();

    if (config.showActionsColumn && config.columns && Array.isArray(config.columns)) {
        config.columns.push({
            width: config.actionsColumnWidth || 50
            ,menuDisabled: true
            ,renderer: {
                fn: this.actionsColumnRenderer,
                scope: this
            }
        });
    }

    MODx.grid.LocalGrid.superclass.constructor.call(this,config);
    this.addEvents({
        beforeRemoveRow: true,
        afterRemoveRow: true
    });
    this.on('rowcontextmenu',this._showMenu,this);
};

Ext.extend(MODx.grid.LocalGrid,Ext.grid.EditorGridPanel,{
    windows: {}

    ,_loadStore: function(config) {
        if (config.grouping) {
            this.store = new Ext.data.GroupingStore({
                data: config.data || []
                ,reader: new Ext.data.ArrayReader({},config.fields || [])
                ,sortInfo: config.sortInfo || {
                    field: config.sortBy || 'name'
                    ,direction: config.sortDir || 'ASC'
                }
                ,groupField: config.groupBy || 'name'
            });
        } else {
            this.store = new Ext.data.SimpleStore({
                fields: config.fields
                ,data: config.data || []
            })
        }
        return this.store;
    }

    ,loadWindow: function(btn,e,win,or) {
        var r = this.menu.record;
        if (!this.windows[win.xtype]) {
            Ext.applyIf(win,{
                scope: this
                ,success: this.refresh
                ,record: win.blankValues ? {} : r
            });
            if (or) {
                Ext.apply(win,or);
            }
            this.windows[win.xtype] = Ext.ComponentMgr.create(win);
        }
        if (this.windows[win.xtype].setValues && win.blankValues !== true && r != undefined) {
            this.windows[win.xtype].setValues(r);
        }
        this.windows[win.xtype].show(e.target);
    }

    ,_loadColumnModel: function() {
        if (this.config.columns) {
            var c = this.config.columns;
            for (var i=0;i<c.length;i++) {
                if (typeof(c[i].editor) == 'string') {
                    c[i].editor = eval(c[i].editor);
                }
                if (typeof(c[i].renderer) == 'string') {
                    c[i].renderer = eval(c[i].renderer);
                }
                if (typeof(c[i].editor) == 'object' && c[i].editor.xtype) {
                    var r = c[i].editor.renderer;
                    c[i].editor = Ext.ComponentMgr.create(c[i].editor);
                    if (r === true) {
                        if (c[i].editor && c[i].editor.store && !c[i].editor.store.isLoaded && c[i].editor.config.mode != 'local') {
                            c[i].editor.store.load();
                            c[i].editor.store.isLoaded = true;
                        }
                        c[i].renderer = Ext.util.Format.comboRenderer(c[i].editor);
                    } else if (c[i].editor.initialConfig.xtype === 'datefield') {
                        c[i].renderer = Ext.util.Format.dateRenderer(c[i].editor.initialConfig.format || 'Y-m-d');
                    } else if (r === 'boolean') {
                        c[i].renderer = this.rendYesNo;
                    } else if (r === 'password') {
                        c[i].renderer = this.rendPassword;
                    } else if (r === 'local' && typeof(c[i].renderer) == 'string') {
                        c[i].renderer = eval(c[i].renderer);
                    }
                }

                /**
                 * When no renderer is provided, automatically apply the htmlEncode renderer to protect
                 * against XSS vulnerabilities. Columns that do have a renderer applied are assumed to
                 * implement their own protection.
                 */
                if (Ext.isEmpty(c[i].renderer)) {
                    c[i].renderer = Ext.util.Format.htmlEncode;
                }

                /**
                 * When the field has an editor defined, wrap the (optional) renderer with
                 * a special renderer that applies a class and tooltip to indicate the
                 * column is editable.
                 */
                if (c[i].editor) {
                    c[i].renderer = this.renderEditableColumn(c[i].renderer);
                }
            }
            this.cm = new Ext.grid.ColumnModel(c);
        }
    }

    ,renderEditableColumn: function(renderer) {
        return function(value, metaData, record, rowIndex, colIndex, store) {
            if (renderer) {
                if (typeof renderer.fn === 'function') {
                    var scope = (renderer.scope) ? renderer.scope : false;
                    renderer = renderer.fn.bind(scope);
                }

                if (typeof renderer === 'function') {
                    value = renderer(value, metaData, record, rowIndex, colIndex, store);
                }
            }
            metaData.css = ['x-editable-column', metaData.css || ''].join(' ');

            return value;
        }
    }

    ,_showMenu: function(g,ri,e) {
        e.stopEvent();
        e.preventDefault();
        this.menu.recordIndex = ri;
        this.menu.record = this.getStore().getAt(ri).data;
        if (!this.getSelectionModel().isSelected(ri)) {
            this.getSelectionModel().selectRow(ri);
        }
        this.menu.removeAll();
        var m = this.getMenu(g,ri);
        if (m) {
            this.addContextMenuItem(m);
            this.menu.showAt(e.xy);
        }
    }

    ,getMenu: function() {
        return this.menu.record.menu;
    }

    ,addContextMenuItem: function(items) {
        var l = items.length;
        for(var i = 0; i < l; i++) {
            var options = items[i];

            if (options == '-') {
                this.menu.add('-');
                continue;
            }
            var h = Ext.emptyFn;
            if (options.handler) {
                h = eval(options.handler);
                if (h && typeof(h) == 'object' && h.xtype) {
                    h = this.loadWindow.createDelegate(this,[h],true);
                }
            } else {
                h = function(itm) {
                    var o = itm.options;
                    var id = this.menu.record.id;
                    var w = Ext.get('modx_content');
                    if (o.confirm) {
                        Ext.Msg.confirm('',o.confirm,function(e) {
                            if (e == 'yes') {
                                var a = Ext.urlEncode(o.params || {action: o.action});
                                var s = '?id='+id+'&'+a;
                                if (w === null) {
                                    location.href = s;
                                } else { w.dom.src = s; }
                            }
                        },this);
                    } else {
                        var a = Ext.urlEncode(o.params || {action: o.action});
                        var s = '?id='+id+'&'+a;
                        if (w === null) {
                            location.href = s;
                        } else { w.dom.src = s; }
                    }
                };
            }
            this.menu.add({
                id: options.id || Ext.id()
                ,text: options.text
                ,scope: this
                ,options: options
                ,handler: h
            });
        }
    }


    ,remove: function(config) {
        if (this.destroying) {
            return MODx.grid.LocalGrid.superclass.remove.apply(this, arguments);
        }
        var r = this.getSelectionModel().getSelected();
        if (this.fireEvent('beforeRemoveRow',r)) {
            Ext.Msg.confirm(config.title || '',config.text || '',function(e) {
                if (e == 'yes') {
                    this.getStore().remove(r);
                    this.fireEvent('afterRemoveRow',r);
                }
            },this);
        }
    }

    ,encode: function() {
        var s = this.getStore();
        var ct = s.getCount();
        var rs = this.config.encodeByPk ? {} : [];
        var r;
        for (var j=0;j<ct;j++) {
            r = s.getAt(j).data;
            r.menu = null;
            if (this.config.encodeAssoc) {
               rs[r[this.config.encodeByPk || 'id']] = r;
            } else {
               rs.push(r);
            }
        }

        return Ext.encode(rs);
    }

    ,expandAll: function() {

        var expander = this.findExpanderPlugin(this.config.plugins);

        if (!expander) {
            return false;
        }

        var rows = this.getView().getRows();

        for (var i = 0; i < rows.length; i++) {
            expander.expandRow(rows[i]);
        }

        if (this.tools['plus'] !== undefined) {
            this.tools['plus'].hide();
        }

        if (this.tools['minus'] !== undefined) {
            this.tools['minus'].show();
        }

        return true;
    }

    ,collapseAll: function() {

        var expander = this.findExpanderPlugin(this.config.plugins);

        if (!expander) {
            return false;
        }

        var rows = this.getView().getRows();

        for (var i = 0; i < rows.length; i++) {
            expander.collapseRow(rows[i]);
        }

        if (this.tools['minus'] !== undefined) {
            this.tools['minus'].hide();
        }

        if (this.tools['plus'] !== undefined) {
            this.tools['plus'].show();
        }

        return true;
    }

    /**
     * Returns first found expander plugin
     * @param plugins
     */
    ,findExpanderPlugin: function (plugins) {

        if (Ext.isObject(plugins)) {
            plugins = [plugins];
        }

        var index = Ext.each(plugins, function (item) {
            if (item.id !== undefined && item.id === 'expander') {
                return false;
            }
        });

        return plugins[index];
    }

    ,rendYesNo: function(d,c) {
        switch(d) {
            case '':
                return '-';
            case false:
                c.css = 'red';
                return _('no');
            case true:
                c.css = 'green';
                return _('yes');
        }
    }

    ,rendPassword: function(v) {
        var z = '';
        for (var i=0;i<v.length;i++) {
            z = z+'*';
        }
        return z;
    }

    ,_getActionsColumnTpl: function () {
        return new Ext.XTemplate('<tpl for=".">'
            + '<tpl if="actions !== null">'
            + '<ul class="x-grid-buttons">'
            + '<tpl for="actions">'
            + '<li><i class="x-grid-action icon icon-{icon:htmlEncode}" title="{text:htmlEncode}" data-action="{action:htmlEncode}"></i></li>'
            + '</tpl>'
            + '</ul>'
            + '</tpl>'
            + '</tpl>', {
            compiled: true
        });
    }

    ,actionsColumnRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        var actions = this.getActions.apply(this, arguments);

        if (this.config.disableContextMenuAction !== true) {
            actions.push({
                text: _('context_menu'),
                action: 'contextMenu',
                icon: 'gear'
            });
        }

        return this._getActionsColumnTpl().apply({
            actions: actions
        });
    }

    ,renderLink: function(v,attr) {
        var el = new Ext.Element(document.createElement('a'));
        el.addClass('x-grid-link');
        el.dom.title = _('edit');
        for (var i in attr) {
            el.dom[i] = attr[i];
        }
        el.dom.innerHTML = Ext.util.Format.htmlEncode(v);
        return el.dom.outerHTML;
    }

    ,getActions: function(value, metaData, record, rowIndex, colIndex, store) {
        return [];
    }

    ,onClick: function(e) {
        var target = e.getTarget();
        if (!target.classList.contains('x-grid-action')) return;
        if (!target.dataset.action) return;

        var actionHandler = 'action' + target.dataset.action.charAt(0).toUpperCase() + target.dataset.action.slice(1);
        if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
            actionHandler = target.dataset.action;
            if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
                return;
            }
        }

        var record = this.getSelectionModel().getSelected();
        var recordIndex = this.store.indexOf(record);
        this.menu.record = record.data;

        this[actionHandler](record, recordIndex, e);
    },

    actionContextMenu: function(record, recordIndex, e) {
        this._showMenu(this, recordIndex, e);
    }
});
Ext.reg('grid-local',MODx.grid.LocalGrid);
Ext.reg('modx-grid-local',MODx.grid.LocalGrid);

/* grid extensions */
/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.grid');

/**
 * @class Ext.ux.grid.RowExpander
 * @extends Ext.util.Observable
 * Plugin (ptype = 'rowexpander') that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 *
 * @ptype rowexpander
 */
Ext.ux.grid.RowExpander = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter : true,
    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick : true,

    header : '',
    width : 20,
    sortable : false,
    fixed : true,
    hideable: false,
    menuDisabled : true,
    dataIndex : '',
    id : 'expander',
    lazyRender : true,
    enableCaching : true,

    constructor: function(config){
        Ext.apply(this, config);

        this.addEvents({
            /**
             * @event beforeexpand
             * Fires before the row expands. Have the listener return false to prevent the row from expanding.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforeexpand: true,
            /**
             * @event expand
             * Fires after the row expands.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            expand: true,
            /**
             * @event beforecollapse
             * Fires before the row collapses. Have the listener return false to prevent the row from collapsing.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforecollapse: true,
            /**
             * @event collapse
             * Fires after the row collapses.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            collapse: true
        });

        Ext.ux.grid.RowExpander.superclass.constructor.call(this);

        if(this.tpl){
            if(typeof this.tpl == 'string'){
                this.tpl = new Ext.Template(this.tpl);
            }
            this.tpl.compile();
        }

        this.state = {};
        this.bodyContent = {};
    },

    getRowClass : function(record, rowIndex, p, ds){
        p.cols = p.cols-1;
        var content = this.bodyContent[record.id];
        if(!content && !this.lazyRender){
            content = this.getBodyContent(record, rowIndex);
        }
        if(content){
            p.body = content;
        }
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },

    init : function(grid){
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;


        grid.on('render', this.onRender, this);
        grid.on('destroy', this.onDestroy, this);
    },

    // @private
    onRender: function() {
        var grid = this.grid;
        var mainBody = grid.getView().mainBody;
        mainBody.on('mousedown', this.onMouseDown, this, {delegate: '.x-grid3-row-expander'});
        if (this.expandOnEnter) {
            this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
                'enter' : this.onEnter,
                scope: this
            });
        }
        if (this.expandOnDblClick) {
            grid.on('rowdblclick', this.onRowDblClick, this);
        }
    },

    // @private
    onDestroy: function() {
        if(this.keyNav){
            this.keyNav.disable();
            delete this.keyNav;
        }
        /*
         * A majority of the time, the plugin will be destroyed along with the grid,
         * which means the mainBody won't be available. On the off chance that the plugin
         * isn't destroyed with the grid, take care of removing the listener.
         */
        var mainBody = this.grid.getView().mainBody;
        if(mainBody){
            mainBody.un('mousedown', this.onMouseDown, this);
        }
    },
    // @private
    onRowDblClick: function(grid, rowIdx, e) {
        this.toggleRow(rowIdx);
    },

    onEnter: function(e) {
        var g = this.grid;
        var sm = g.getSelectionModel();
        var sels = sm.getSelections();
        for (var i = 0, len = sels.length; i < len; i++) {
            var rowIdx = g.getStore().indexOf(sels[i]);
            this.toggleRow(rowIdx);
        }
    },

    getBodyContent : function(record, index){
        if(!this.enableCaching){
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if(!content){
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
        return content;
    },

    onMouseDown : function(e, t){
        e.stopEvent();
        var row = e.getTarget('.x-grid3-row');
        this.toggleRow(row);
    },

    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },

    beforeExpand : function(record, body, rowIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.tpl && this.lazyRender){
                body.innerHTML = this.getBodyContent(record, rowIndex);
            }
            return true;
        }else{
            return false;
        }
    },

    toggleRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },

    expandRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(record, body, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },

    collapseRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if(this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false){
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});

Ext.preg('rowexpander', Ext.ux.grid.RowExpander);

//backwards compat
Ext.grid.RowExpander = Ext.ux.grid.RowExpander;

Ext.ns('Ext.ux.grid');

Ext.ux.grid.CheckColumn = function (a) {
    Ext.apply(this, a);
    if (!this.id) {
        this.id = Ext.id()
    }
    this.renderer = this.renderer.createDelegate(this)
};
Ext.ux.grid.CheckColumn.prototype = {
    init: function (b) {
        this.grid = b;
        this.grid.on('render', function () {
            var a = this.grid.getView();
            a.mainBody.on('mousedown', this.onMouseDown, this)
        }, this);
        this.grid.on('destroy', this.onDestroy, this)
    }, onMouseDown: function (e, t) {
        this.grid.fireEvent('rowclick');
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var a = this.grid.getView().findRowIndex(t);
            var b = this.grid.store.getAt(a);
            var sv = b.data[this.dataIndex];
            b.set(this.dataIndex, !sv);
            this.grid.fireEvent('afteredit', {
                grid: this.grid,
                record: b,
                field: this.dataIndex,
                originalValue: sv,
                value: b.data[this.dataIndex],
                cancel: false
            });
        }
    }, renderer: function (v, p, a) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>'
    }, onDestroy: function () {
        var mainBody = this.grid.getView().mainBody;
        if (mainBody) {
            mainBody.un('mousedown', this.onMouseDown, this);
        }
    }
};
Ext.preg('checkcolumn', Ext.ux.grid.CheckColumn);
Ext.grid.CheckColumn = Ext.ux.grid.CheckColumn;

Ext.grid.PropertyColumnModel=function(a,b){var g=Ext.grid,f=Ext.form;this.grid=a;g.PropertyColumnModel.superclass.constructor.call(this,[{header:this.nameText,width:50,sortable:true,dataIndex:'name',id:'name',menuDisabled:true},{header:this.valueText,width:50,resizable:false,dataIndex:'value',id:'value',menuDisabled:true}]);this.store=b;var c=new f.Field({autoCreate:{tag:'select',children:[{tag:'option',value:'true',html:'true'},{tag:'option',value:'false',html:'false'}]},getValue:function(){return this.el.dom.value=='true'}});this.editors={'date':new g.GridEditor(new f.DateField({selectOnFocus:true})),'string':new g.GridEditor(new f.TextField({selectOnFocus:true})),'number':new g.GridEditor(new f.NumberField({selectOnFocus:true,style:'text-align:left;'})),'boolean':new g.GridEditor(c)};this.renderCellDelegate=this.renderCell.createDelegate(this);this.renderPropDelegate=this.renderProp.createDelegate(this)};Ext.extend(Ext.grid.PropertyColumnModel,Ext.grid.ColumnModel,{nameText:'Name',valueText:'Value',dateFormat:'m/j/Y',renderDate:function(a){return a.dateFormat(this.dateFormat)},renderBool:function(a){return a?'true':'false'},isCellEditable:function(a,b){return a==1},getRenderer:function(a){return a==1?this.renderCellDelegate:this.renderPropDelegate},renderProp:function(v){return this.getPropertyName(v)},renderCell:function(a){var b=a;if(Ext.isDate(a)){b=this.renderDate(a)}else if(typeof a=='boolean'){b=this.renderBool(a)}return Ext.util.Format.htmlEncode(b)},getPropertyName:function(a){var b=this.grid.propertyNames;return b&&b[a]?b[a]:a},getCellEditor:function(a,b){var p=this.store.getProperty(b),n=p.data.name,val=p.data.value;if(this.grid.customEditors[n]){return this.grid.customEditors[n]}if(Ext.isDate(val)){return this.editors.date}else if(typeof val=='number'){return this.editors.number}else if(typeof val=='boolean'){return this.editors['boolean']}else{return this.editors.string}},destroy:function(){Ext.grid.PropertyColumnModel.superclass.destroy.call(this);for(var a in this.editors){Ext.destroy(a)}}});

/**
 * MODx JSON Grid
 * Local grid with inline editing, it converts the grid value from/to JSON and submits the JSON in a hidden field.
 * The grid could be sorted by drag & drop, new values could be added with a button and each row could be deleted.
 *
 * It could be configured with the fieldConfig property, containing an array of field configs:
 *
 * fieldConfig: [{
 *    name: 'whatever', // required, name 'id' is reserved and can't be used
 *    width: 100, // defaults to 100
 *    xtype: 'textfield', // defaults to textfield
 *    allowBlank: true, // defaults to true
 *    header: _('whatever') // defaults to the lexicon entry of name value of the current field config
 * }];
 *
 * If there is no fieldConfig property set, the following default fieldConfig is used:
 *
 * [{name: 'key'}, {name: 'value'}]
 */
MODx.grid.JsonGrid = function (config) {
    config = config || {};
    this.ident = config.ident || 'jsongrid-mecitem' + Ext.id();
    this.hiddenField = new Ext.form.TextArea({
        name: config.hiddenName || config.name,
        hidden: true
    });
    this.fieldConfig = config.fieldConfig || [{name: 'key'}, {name: 'value'}];
    this.fieldConfig.push({name: 'id', hidden: true});
    this.fieldColumns = [];
    this.fieldNames = [];
    Ext.each(this.fieldConfig, function (el) {
        this.fieldNames.push(el.name);
        this.fieldColumns.push({
            header: el.header || _(el.name),
            dataIndex: el.name,
            editable: true,
            menuDisabled: true,
            hidden: el.hidden || false,
            editor: {
                xtype: el.xtype || 'textfield',
                allowBlank: el.allowBlank || true,
                enableKeyEvents: true,
                fieldname: el.name,
                listeners: {
                    change: {
                        fn: this.saveValue,
                        scope: this
                    },
                    keyup: {
                        fn: function (sb) {
                            var record = this.getSelectionModel().getSelected();
                            if (record) {
                                record.set(sb.fieldname, sb.el.dom.value);
                                this.saveValue();
                            }
                        },
                        scope: this
                    }
                }
            },
            renderer: function(value, metadata) {
                metadata.css += 'x-editable-column ';
                return value;
            },
            width: el.width || 100
        });
    }, this);
    Ext.applyIf(config, {
        id: this.ident + '-json-grid',
        fields: this.fieldNames,
        autoHeight: true,
        store: new Ext.data.JsonStore({
            fields: this.fieldNames,
            data: this.loadValue(config.value)
        }),
        enableDragDrop: true,
        ddGroup: this.ident + '-json-grid-dd',
        labelStyle: 'position: absolute',
        columns: this.fieldColumns,
        disableContextMenuAction: true,
        tbar: ['->', {
            text: '<i class="icon icon-plus"></i> ' + _('add'),
            cls: 'primary-button',
            handler: this.addElement,
            scope: this
        }],
        listeners: {
            render: {
                fn: this.renderListener,
                scope: this
            }
        }
    });
    MODx.grid.JsonGrid.superclass.constructor.call(this, config)
};
Ext.extend(MODx.grid.JsonGrid, MODx.grid.LocalGrid, {
    getMenu: function () {
        var m = [];
        m.push({
            text: _('remove'),
            handler: this.removeElement
        });
        return m;
    },
    getActions: function () {
        return [{
            action: 'removeElement',
            icon: 'trash-o',
            text: _('remove')
        }]
    },
    addElement: function () {
        var ds = this.getStore();
        var row = {};
        Ext.each(this.fieldNames, function (fieldname) {
            row[fieldname] = '';
        });
        row['id'] = this.getStore().getCount();
        this.getStore().insert(this.getStore().getCount(), new ds.recordType(row));
        this.getView().refresh();
        this.getSelectionModel().selectRow(0);
    },
    removeElement: function () {
        Ext.Msg.confirm(_('remove') || '', _('confirm_remove') || '', function (e) {
            if (e === 'yes') {
                var ds = this.getStore();
                var rows = this.getSelectionModel().getSelections();
                if (!rows.length) {
                    return false;
                }
                for (var i = 0; i < rows.length; i++) {
                    var id = rows[i].id;
                    var index = ds.findBy(function (record) {
                        if (record.id === id) {
                            return true;
                        }
                    });
                    ds.removeAt(index);
                }
                this.getView().refresh();
                this.saveValue();
            }
        }, this);
    },
    renderListener: function (grid) {
        new Ext.dd.DropTarget(grid.container, {
            copy: false,
            ddGroup: this.ident + '-json-grid-dd',
            notifyDrop: function (dd, e, data) {
                var ds = grid.store;
                var sm = grid.getSelectionModel();
                var rows = sm.getSelections();

                var dragData = dd.getDragData(e);
                if (dragData) {
                    var cindex = dragData.rowIndex;
                    if (typeof (cindex) !== "undefined") {
                        for (var i = 0; i < rows.length; i++) {
                            ds.remove(ds.getById(rows[i].id));
                        }
                        ds.insert(cindex, data.selections);
                        sm.clearSelections();
                    }
                }
                grid.getView().refresh();
                grid.saveValue();
            }
        });
        this.add(this.hiddenField);
        this.saveValue();
    },
    loadValue: function (value) {
        value = Ext.util.JSON.decode(value);
        if (value && Array.isArray(value)) {
            Ext.each(value, function (record, idx) {
                value[idx]['id'] = idx;
            });
        } else {
            value = [];
        }
        return value;
    },
    saveValue: function () {
        var value = [];
        Ext.each(this.getStore().getRange(), function (record) {
            var row = {};
            Ext.each(this.fieldNames, function (fieldname) {
                if (fieldname !== 'id') {
                    row[fieldname] = record.data[fieldname];
                }
            });
            value.push(row);
        }, this);
        this.hiddenField.setValue(Ext.util.JSON.encode(value));
    },
    _getActionsColumnTpl: function () {
        return new Ext.XTemplate('<tpl for=".">'
            + '<tpl if="actions !== null">'
            + '<ul class="x-grid-buttons">'
            + '<tpl for="actions">'
            + '<li><i class="x-grid-action icon icon-{icon:htmlEncode}" title="{text:htmlEncode}" data-action="{action:htmlEncode}"></i></li>'
            + '</tpl>'
            + '</ul>'
            + '</tpl>'
            + '</tpl>', {
            compiled: true
        });
    },
    actionsColumnRenderer: function (value, metaData, record, rowIndex, colIndex, store) {
        return this._getActionsColumnTpl().apply({
            actions: this.getActions()
        });
    },
    onClick: function (e) {
        var target = e.getTarget();
        if (!target.classList.contains('x-grid-action')) return;
        if (!target.dataset.action) return;

        var actionHandler = 'action' + target.dataset.action.charAt(0).toUpperCase() + target.dataset.action.slice(1);
        if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
            actionHandler = target.dataset.action;
            if (!this[actionHandler] || (typeof this[actionHandler] !== 'function')) {
                return;
            }
        }

        var record = this.getSelectionModel().getSelected();
        var recordIndex = this.store.indexOf(record);
        this.menu.record = record.data;

        this[actionHandler](record, recordIndex, e);
    }
});
Ext.reg('grid-json', MODx.grid.JsonGrid);
Ext.reg('modx-grid-json', MODx.grid.JsonGrid);
