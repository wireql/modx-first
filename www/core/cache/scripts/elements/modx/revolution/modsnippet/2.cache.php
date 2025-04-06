<?php  return '$tpl = $modx->getOption(\'tpl\', $scriptProperties, \'serviceCard\');

    $output = \'\';
    $services = $modx->getCollection(\'modResource\', [
        \'parent\' => 8,
        \'published\' => 1,
        \'deleted\' => 0,
    ]);
    
    foreach ($services as $service) {
        $badges = $service->getTVValue(\'service_badges\');
        $badges = !empty($badges) ? explode(\'||\', $badges) : [];

        
        $badgesHTML = $modx->runSnippet(\'generateBadges\', [
            \'badges\' => $badges
        ]);
    
        $output .= $modx->getChunk($tpl, [
            \'link\' => $modx->makeUrl($service->get(\'id\')),
            \'image\' => $service->getTVValue(\'service_image\'),
            \'alt\' => $service->get(\'pagetitle\'),
            \'title\' => $service->get(\'longtitle\'),
            \'price\' => \'от \' . ($service->getTVValue(\'service_price\') ?: \'0\') . \' ₽\',
            \'badges\' => $badgesHTML,
        ]);
    }
    
    return $output;
return;
';