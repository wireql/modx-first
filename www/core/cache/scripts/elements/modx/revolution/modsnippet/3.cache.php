<?php  return '$output = \'\';
    foreach ($badges as $badgeText) {
        $output .= \'<div class="text-sm font-medium py-2 px-4 bg-white rounded-full">\'
                 . $badgeText
                 . \'</div>\';
    }
    
    return $output;
return;
';