<?php
$badges = !empty($badges) ? explode('||', $badges) : [];
    
    $output = '';
    foreach ($badges as $badgeText) {
        $output .= '<div class="text-sm font-medium py-2 px-4 text-white bg-gray-500 w-fit rounded-full">'
                 . $badgeText
                 . '</div>';
    }
    
    return $output;
return;
