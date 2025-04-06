<?php
/* Smarty version 4.5.5, created on 2025-04-03 21:19:38
  from '/var/www/html/manager/templates/default/element/tv/renders/input/number.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.5',
  'unifunc' => 'content_67eefb6ae0e119_44957036',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'c97f9b5c27b5044552d9b0741342ace2ab20e33c' => 
    array (
      0 => '/var/www/html/manager/templates/default/element/tv/renders/input/number.tpl',
      1 => 1743578432,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_67eefb6ae0e119_44957036 (Smarty_Internal_Template $_smarty_tpl) {
?><input id="tv<?php echo $_smarty_tpl->tpl_vars['tv']->value->id;?>
" name="tv<?php echo $_smarty_tpl->tpl_vars['tv']->value->id;?>
"
    type="text" class="textfield"
    value="<?php echo htmlspecialchars((string)$_smarty_tpl->tpl_vars['tv']->value->get('value'), ENT_QUOTES, 'UTF-8', true);?>
"
    <?php echo (($tmp = $_smarty_tpl->tpl_vars['style']->value ?? null)===null||$tmp==='' ? '' ?? null : $tmp);?>

    tvtype="<?php echo $_smarty_tpl->tpl_vars['tv']->value->type;?>
"
/>

<?php echo '<script'; ?>
>
// <![CDATA[
document.getElementById('tv<?php echo $_smarty_tpl->tpl_vars['tv']->value->id;?>
').setAttribute('autocomplete', globalAutoCompleteSetting);

Ext.onReady(function() {
    const fld = MODx.load({
    
        xtype: 'numberfield'
        ,itemId: 'tv<?php echo $_smarty_tpl->tpl_vars['tv']->value->id;?>
'
        ,applyTo: 'tv<?php echo $_smarty_tpl->tpl_vars['tv']->value->id;?>
'
        ,width: '99%'
        ,enableKeyEvents: true
        ,autoStripChars: true
        ,allowBlank: <?php if ($_smarty_tpl->tpl_vars['params']->value['allowBlank'] == 1 || $_smarty_tpl->tpl_vars['params']->value['allowBlank'] == 'true') {?>true<?php } else { ?>false<?php }?>
        ,allowDecimals: <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['allowDecimals'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) && (($tmp = $_smarty_tpl->tpl_vars['params']->value['allowDecimals'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != 'false' && (($tmp = $_smarty_tpl->tpl_vars['params']->value['allowDecimals'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != 'No') {?>true<?php } else { ?>false<?php }?>
        ,decimalPrecision: <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['decimalPrecision'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) >= 0) {
echo sprintf("%d",(($tmp = $_smarty_tpl->tpl_vars['params']->value['decimalPrecision'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp));
} else { ?>2<?php }?>
        ,strictDecimalPrecision: <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['strictDecimalPrecision'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) && (($tmp = $_smarty_tpl->tpl_vars['params']->value['strictDecimalPrecision'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != 'false' && (($tmp = $_smarty_tpl->tpl_vars['params']->value['strictDecimalPrecision'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != 'No') {?>true<?php } else { ?>false<?php }?>
        ,decimalSeparator: <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['decimalSeparator'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp)) {?>'<?php echo (($tmp = $_smarty_tpl->tpl_vars['params']->value['decimalSeparator'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp);?>
'<?php } else { ?>'.'<?php }?>
        <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['maxValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != '' && is_numeric((($tmp = $_smarty_tpl->tpl_vars['params']->value['maxValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp))) {?>,maxValue: <?php echo (($tmp = $_smarty_tpl->tpl_vars['params']->value['maxValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp);
}?>
        <?php if ((($tmp = $_smarty_tpl->tpl_vars['params']->value['minValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp) != '' && is_numeric((($tmp = $_smarty_tpl->tpl_vars['params']->value['minValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp))) {?>,minValue: <?php echo (($tmp = $_smarty_tpl->tpl_vars['params']->value['minValue'] ?? null)===null||$tmp==='' ? '' ?? null : $tmp);
}?>
        ,msgTarget: 'under'
    
        ,listeners: {
            keydown: {
                fn: MODx.fireResourceFormChange,
                scope: this
            }
        }
    });
    MODx.makeDroppable(fld);
    Ext.getCmp('modx-panel-resource').getForm().add(fld);
});

// ]]>
<?php echo '</script'; ?>
>
<?php }
}
