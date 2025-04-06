<?php  return array (
  'resourceClass' => 'MODX\\Revolution\\modDocument',
  'resource' => 
  array (
    'id' => 11,
    'type' => 'document',
    'pagetitle' => 'Установка бытовой техники',
    'longtitle' => 'Установка и подключение бытовой техники',
    'description' => '',
    'alias' => 'установка-бытовой-техники',
    'link_attributes' => '',
    'published' => 1,
    'pub_date' => 0,
    'unpub_date' => 0,
    'parent' => 8,
    'isfolder' => 0,
    'introtext' => '',
    'content' => '',
    'richtext' => 1,
    'template' => 3,
    'menuindex' => 2,
    'searchable' => 1,
    'cacheable' => 1,
    'createdby' => 1,
    'createdon' => 1743796240,
    'editedby' => 1,
    'editedon' => 1743796313,
    'deleted' => 0,
    'deletedon' => 0,
    'deletedby' => 0,
    'publishedon' => 1743796260,
    'publishedby' => 1,
    'menutitle' => '',
    'content_dispo' => 0,
    'hidemenu' => 0,
    'class_key' => 'MODX\\Revolution\\modDocument',
    'context_key' => 'web',
    'content_type' => 1,
    'uri' => 'index/services/установка-бытовой-техники.html',
    'uri_override' => 0,
    'hide_children_in_tree' => 0,
    'show_in_tree' => 1,
    'properties' => NULL,
    'alias_visible' => 1,
    'service_price' => 
    array (
      0 => 'service_price',
      1 => '400',
      2 => 'default',
      3 => NULL,
      4 => 'number',
    ),
    'service_image' => 
    array (
      0 => 'service_image',
      1 => 'assets/templates/img/29b3572e784d0e1101b3c671048bd7a2.png',
      2 => 'default',
      3 => NULL,
      4 => 'image',
    ),
    'service_badges' => 
    array (
      0 => 'service_badges',
      1 => 'Новинка',
      2 => 'delim',
      3 => NULL,
      4 => 'listbox-multiple',
    ),
    '_content' => '<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/assets/templates/img/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Установка бытовой техники - MODX Revolution</title>

        <script type="module" crossorigin src="/assets/templates/js/index.js"></script>
        <link rel="stylesheet" crossorigin href="/assets/templates/css/index.css">
    </head>
    <body>
        
        <header class="bg-gray-550">
    <div class="py-6 px-6 lg:px-[120px]">
        <div
            class="font-medium text-sm lg:text-base leading-[100%] text-white"
        >
            Header Logo
        </div>
    </div>
</header>
        
        <section class="py-12 lg:py-16 px-6 lg:px-[120px]">
            <div class="flex flex-col items-center">
                <div class="max-w-5xl w-full">
                    <img
                        src="http://localhost/assets/templates/img/29b3572e784d0e1101b3c671048bd7a2.png"
                        alt="Установка бытовой техники"
                        class="h-96 w-full object-cover rounded-xl"
                    />
                    <div class="w-full mt-6">
                        <div class="max-w-[700px]">
                            <div class="flex flex-wrap gap-4">
                                [[!generateBadgesOnPage?
                                    &badges=`Новинка`
                                ]]
                            </div>
                            <div class="text-2xl lg:text-4xl font-bold mt-2">
                                Установка и подключение бытовой техники
                            </div>
                            <div class="mt-2 font-xs text-gray-550">
                                от 400 ₽
                            </div>
                        </div>

                        <div class="mt-6 text-xs lg:text-sm">
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <footer class="bg-gray-560">
    <div class="py-12 lg:py-16 pb-[247px] px-6 lg:px-[120px]">
        <div
            class="font-medium text-xs lg:text-base text-center lg:text-start leading-[100%]"
        >
            Footer Logo
        </div>
    </div>
</footer>

    </body>
</html>',
    '_isForward' => false,
  ),
  'contentType' => 
  array (
    'id' => 1,
    'name' => 'HTML',
    'description' => 'HTML content',
    'mime_type' => 'text/html',
    'file_extensions' => '.html',
    'icon' => '',
    'headers' => NULL,
    'binary' => 0,
  ),
  'policyCache' => 
  array (
  ),
  'elementCache' => 
  array (
    '[[*pagetitle]]' => 'Установка бытовой техники',
    '[[$header]]' => '<header class="bg-gray-550">
    <div class="py-6 px-6 lg:px-[120px]">
        <div
            class="font-medium text-sm lg:text-base leading-[100%] text-white"
        >
            Header Logo
        </div>
    </div>
</header>',
    '[[*service_image]]' => 'assets/templates/img/29b3572e784d0e1101b3c671048bd7a2.png',
    '[[*service_badges]]' => 'Новинка',
    '[[*longtitle]]' => 'Установка и подключение бытовой техники',
    '[[*service_price ?? \'0\']]' => '400',
    '[[$footer]]' => '<footer class="bg-gray-560">
    <div class="py-12 lg:py-16 pb-[247px] px-6 lg:px-[120px]">
        <div
            class="font-medium text-xs lg:text-base text-center lg:text-start leading-[100%]"
        >
            Footer Logo
        </div>
    </div>
</footer>',
  ),
  'sourceCache' => 
  array (
    'MODX\\Revolution\\modChunk' => 
    array (
      'header' => 
      array (
        'fields' => 
        array (
          'id' => 1,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'header',
          'description' => '',
          'editor_type' => 0,
          'category' => 0,
          'cache_type' => 0,
          'snippet' => '<header class="bg-gray-550">
    <div class="py-6 px-6 lg:px-[120px]">
        <div
            class="font-medium text-sm lg:text-base leading-[100%] text-white"
        >
            Header Logo
        </div>
    </div>
</header>',
          'locked' => false,
          'properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '<header class="bg-gray-550">
    <div class="py-6 px-6 lg:px-[120px]">
        <div
            class="font-medium text-sm lg:text-base leading-[100%] text-white"
        >
            Header Logo
        </div>
    </div>
</header>',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
      'footer' => 
      array (
        'fields' => 
        array (
          'id' => 2,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'footer',
          'description' => '',
          'editor_type' => 0,
          'category' => 0,
          'cache_type' => 0,
          'snippet' => '<footer class="bg-gray-560">
    <div class="py-12 lg:py-16 pb-[247px] px-6 lg:px-[120px]">
        <div
            class="font-medium text-xs lg:text-base text-center lg:text-start leading-[100%]"
        >
            Footer Logo
        </div>
    </div>
</footer>',
          'locked' => false,
          'properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '<footer class="bg-gray-560">
    <div class="py-12 lg:py-16 pb-[247px] px-6 lg:px-[120px]">
        <div
            class="font-medium text-xs lg:text-base text-center lg:text-start leading-[100%]"
        >
            Footer Logo
        </div>
    </div>
</footer>',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
    ),
    'MODX\\Revolution\\modSnippet' => 
    array (
      'generateBadgesOnPage' => 
      array (
        'fields' => 
        array (
          'id' => 4,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'generateBadgesOnPage',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'cache_type' => 0,
          'snippet' => '$badges = !empty($badges) ? explode(\'||\', $badges) : [];
    
    $output = \'\';
    foreach ($badges as $badgeText) {
        $output .= \'<div class="text-sm font-medium py-2 px-4 text-white bg-gray-500 w-fit rounded-full">\'
                 . $badgeText
                 . \'</div>\';
    }
    
    return $output;',
          'locked' => false,
          'properties' => 
          array (
          ),
          'moduleguid' => '',
          'static' => false,
          'static_file' => '',
          'content' => '$badges = !empty($badges) ? explode(\'||\', $badges) : [];
    
    $output = \'\';
    foreach ($badges as $badgeText) {
        $output .= \'<div class="text-sm font-medium py-2 px-4 text-white bg-gray-500 w-fit rounded-full">\'
                 . $badgeText
                 . \'</div>\';
    }
    
    return $output;',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
    ),
    'MODX\\Revolution\\modTemplateVar' => 
    array (
      'service_image' => 
      array (
        'fields' => 
        array (
          'id' => 2,
          'source' => 1,
          'property_preprocess' => false,
          'type' => 'image',
          'name' => 'service_image',
          'caption' => '',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'locked' => false,
          'elements' => NULL,
          'rank' => 0,
          'display' => 'default',
          'default_text' => '',
          'properties' => 
          array (
          ),
          'input_properties' => 
          array (
            'allowBlank' => 'false',
          ),
          'output_properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
      'service_badges' => 
      array (
        'fields' => 
        array (
          'id' => 3,
          'source' => 1,
          'property_preprocess' => false,
          'type' => 'listbox-multiple',
          'name' => 'service_badges',
          'caption' => '',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'locked' => false,
          'elements' => 'Товар месяца||Скидка||Акция||Новинка',
          'rank' => 0,
          'display' => 'delim',
          'default_text' => '',
          'properties' => 
          array (
          ),
          'input_properties' => 
          array (
            'allowBlank' => 'true',
            'stackItems' => 'false',
            'preserveSelectionOrder' => 'false',
            'title' => '',
            'typeAhead' => '0',
          ),
          'output_properties' => 
          array (
            'delimiter' => '||',
          ),
          'static' => false,
          'static_file' => '',
          'content' => '',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
      'service_price' => 
      array (
        'fields' => 
        array (
          'id' => 1,
          'source' => 1,
          'property_preprocess' => false,
          'type' => 'number',
          'name' => 'service_price',
          'caption' => 'Цена',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'locked' => false,
          'elements' => NULL,
          'rank' => 0,
          'display' => 'default',
          'default_text' => '0',
          'properties' => 
          array (
          ),
          'input_properties' => 
          array (
            'allowBlank' => 'false',
            'minValue' => '0',
            'maxValue' => '1000000',
            'allowDecimals' => '0',
          ),
          'output_properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '0',
        ),
        'policies' => 
        array (
        ),
        'source' => 
        array (
          'id' => 1,
          'name' => 'Filesystem',
          'description' => '',
          'class_key' => 'MODX\\Revolution\\Sources\\modFileMediaSource',
          'properties' => 
          array (
          ),
          'is_stream' => true,
        ),
      ),
    ),
  ),
);