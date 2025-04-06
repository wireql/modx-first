<?php  return array (
  'resourceClass' => 'MODX\\Revolution\\modDocument',
  'resource' => 
  array (
    'id' => 1,
    'type' => 'document',
    'pagetitle' => 'MainPage',
    'longtitle' => 'Поздравляем!',
    'description' => '',
    'alias' => 'index',
    'link_attributes' => '',
    'published' => 1,
    'pub_date' => 0,
    'unpub_date' => 0,
    'parent' => 0,
    'isfolder' => 1,
    'introtext' => '',
    'content' => '<section class="py-12 lg:py-16 px-6 lg:px-[120px]">
    <div class="text-xl lg:text-4xl font-bold leading-[110%]">
        Статьи
    </div>
    <div class="mt-6 lg:mt-11.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-4">
        [[!getArticles]]
    </div>
</section>

<section class="py-12 lg:py-16 px-6 lg:px-[120px]">
    <div class="text-xl lg:text-4xl font-bold leading-[110%]">
        Услуги
    </div>

    <!-- Desktop -->
    <div class="hidden md:grid mt-6 lg:mt-11.5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-4">
        [[!getServices]]
    </div>

    <!-- Mobile -->
    <div class="swiper mt-6 md:hidden!">
        <div class="swiper-wrapper">
            [[!getServices? &tpl=`serviceCardMobile`]]
        </div>
        <div class="swiper-pagination"></div>
    </div>
</section>',
    'richtext' => 1,
    'template' => 2,
    'menuindex' => 0,
    'searchable' => 1,
    'cacheable' => 1,
    'createdby' => 1,
    'createdon' => 1743706554,
    'editedby' => 1,
    'editedon' => 1743793330,
    'deleted' => 0,
    'deletedon' => 0,
    'deletedby' => 0,
    'publishedon' => 0,
    'publishedby' => 0,
    'menutitle' => '',
    'content_dispo' => 0,
    'hidemenu' => 0,
    'class_key' => 'MODX\\Revolution\\modDocument',
    'context_key' => 'web',
    'content_type' => 1,
    'uri' => 'index/',
    'uri_override' => 0,
    'hide_children_in_tree' => 0,
    'show_in_tree' => 1,
    'properties' => NULL,
    'alias_visible' => 1,
    '_content' => '<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/assets/templates/img/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MainPage - MODX Revolution</title>

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
    <div class="text-xl lg:text-4xl font-bold leading-[110%]">
        Статьи
    </div>
    <div class="mt-6 lg:mt-11.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-4">
        [[!getArticles]]
    </div>
</section>

<section class="py-12 lg:py-16 px-6 lg:px-[120px]">
    <div class="text-xl lg:text-4xl font-bold leading-[110%]">
        Услуги
    </div>

    <!-- Desktop -->
    <div class="hidden md:grid mt-6 lg:mt-11.5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-4">
        [[!getServices]]
    </div>

    <!-- Mobile -->
    <div class="swiper mt-6 md:hidden!">
        <div class="swiper-wrapper">
            [[!getServices? &tpl=`serviceCardMobile`]]
        </div>
        <div class="swiper-pagination"></div>
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
    '_isForward' => true,
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
    '[[*pagetitle]]' => 'MainPage',
    '[[$header]]' => '<header class="bg-gray-550">
    <div class="py-6 px-6 lg:px-[120px]">
        <div
            class="font-medium text-sm lg:text-base leading-[100%] text-white"
        >
            Header Logo
        </div>
    </div>
</header>',
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
      'articleCard' => 
      array (
        'fields' => 
        array (
          'id' => 3,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'articleCard',
          'description' => '',
          'editor_type' => 0,
          'category' => 2,
          'cache_type' => 0,
          'snippet' => '<a
    href="[[+link]]"
    class="transition transform delay-150 cursor-pointer hover:shadow-md duration-50 rounded-md"
>
    <img
        src="[[+image]]"
        alt="[[+alt]]"
        class="h-[185px] w-full object-cover rounded-t-md"
    />
    <div class="p-5">
        <div
            class="text-base lg:text-xl font-bold leading-[110%]"
        >
            [[+title]]
        </div>
        <div
            class="text-xs lg:text-sm mt-3 lg:mt-3.5 leading-[120%]"
        >
            [[+description]]
        </div>
        <div
            class="text-xs lg:text-sm mt-6 lg:mt-8 text-gray-550"
        >
            [[+date]]
        </div>
    </div>
</a>',
          'locked' => false,
          'properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '<a
    href="[[+link]]"
    class="transition transform delay-150 cursor-pointer hover:shadow-md duration-50 rounded-md"
>
    <img
        src="[[+image]]"
        alt="[[+alt]]"
        class="h-[185px] w-full object-cover rounded-t-md"
    />
    <div class="p-5">
        <div
            class="text-base lg:text-xl font-bold leading-[110%]"
        >
            [[+title]]
        </div>
        <div
            class="text-xs lg:text-sm mt-3 lg:mt-3.5 leading-[120%]"
        >
            [[+description]]
        </div>
        <div
            class="text-xs lg:text-sm mt-6 lg:mt-8 text-gray-550"
        >
            [[+date]]
        </div>
    </div>
</a>',
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
      'serviceCard' => 
      array (
        'fields' => 
        array (
          'id' => 4,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'serviceCard',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'cache_type' => 0,
          'snippet' => '<a href="[[+link]]" class="border border-gray-150 rounded-md">
    <div class="relative">
        <div class="absolute p-3 flex flex-wrap gap-3">
            [[+badges]]
        </div>
        <img
            src="[[+image]]"
            alt="[[+alt]]"
            class="h-[185px] w-full object-cover rounded-t-md"
        />
    </div>
    <div class="flex flex-col justify-between p-5 h-[180px]">
        <div class="text-xl font-bold leading-[110%]">
            [[+title]]
        </div>
        <div class="text-sm text-gray-550">[[+price]]</div>
    </div>
</a>',
          'locked' => false,
          'properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '<a href="[[+link]]" class="border border-gray-150 rounded-md">
    <div class="relative">
        <div class="absolute p-3 flex flex-wrap gap-3">
            [[+badges]]
        </div>
        <img
            src="[[+image]]"
            alt="[[+alt]]"
            class="h-[185px] w-full object-cover rounded-t-md"
        />
    </div>
    <div class="flex flex-col justify-between p-5 h-[180px]">
        <div class="text-xl font-bold leading-[110%]">
            [[+title]]
        </div>
        <div class="text-sm text-gray-550">[[+price]]</div>
    </div>
</a>',
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
      'serviceCardMobile' => 
      array (
        'fields' => 
        array (
          'id' => 5,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'serviceCardMobile',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'cache_type' => 0,
          'snippet' => '<div class="swiper-slide">
    <a href="[[+link]]" class="border border-gray-150 rounded-md">
        <div class="relative">
            <div class="absolute p-3 flex flex-wrap gap-3">
                [[+badges]]
            </div>
            <img
                src="[[+image]]"
                alt="[[+alt]]"
                class="h-[185px] w-full object-cover rounded-t-md"
            />
        </div>
        <div class="flex flex-col justify-between p-5 h-[180px]">
            <div class="text-xl font-bold leading-[110%]">
                [[+title]]
            </div>
            <div class="text-sm text-gray-550">[[+price]]</div>
        </div>
    </a>
</div>',
          'locked' => false,
          'properties' => 
          array (
          ),
          'static' => false,
          'static_file' => '',
          'content' => '<div class="swiper-slide">
    <a href="[[+link]]" class="border border-gray-150 rounded-md">
        <div class="relative">
            <div class="absolute p-3 flex flex-wrap gap-3">
                [[+badges]]
            </div>
            <img
                src="[[+image]]"
                alt="[[+alt]]"
                class="h-[185px] w-full object-cover rounded-t-md"
            />
        </div>
        <div class="flex flex-col justify-between p-5 h-[180px]">
            <div class="text-xl font-bold leading-[110%]">
                [[+title]]
            </div>
            <div class="text-sm text-gray-550">[[+price]]</div>
        </div>
    </a>
</div>',
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
      'getArticles' => 
      array (
        'fields' => 
        array (
          'id' => 1,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'getArticles',
          'description' => '',
          'editor_type' => 0,
          'category' => 2,
          'cache_type' => 0,
          'snippet' => '$output = \'\';
    $articles = $modx->getCollection(\'modResource\', [
        \'parent\' => 4,
        \'published\' => 1,
        \'deleted\' => 0,
    ]);
    
    foreach ($articles as $article) {
        $output .= $modx->getChunk(\'articleCard\', [
            \'link\' => $modx->makeUrl($article->get(\'id\')),
            \'image\' => $article->getTVValue(\'article_image\'),
            \'alt\' => $article->get(\'pagetitle\'),
            \'title\' => $article->get(\'pagetitle\'),
            \'description\' => $article->get(\'description\') ?: $article->get(\'introtext\'),
            \'date\' => strftime(\'%d.%m.%Y\', strtotime($article->get(\'publishedon\'))),
        ]);
    }
    
    return $output;',
          'locked' => false,
          'properties' => 
          array (
          ),
          'moduleguid' => '',
          'static' => false,
          'static_file' => '',
          'content' => '$output = \'\';
    $articles = $modx->getCollection(\'modResource\', [
        \'parent\' => 4,
        \'published\' => 1,
        \'deleted\' => 0,
    ]);
    
    foreach ($articles as $article) {
        $output .= $modx->getChunk(\'articleCard\', [
            \'link\' => $modx->makeUrl($article->get(\'id\')),
            \'image\' => $article->getTVValue(\'article_image\'),
            \'alt\' => $article->get(\'pagetitle\'),
            \'title\' => $article->get(\'pagetitle\'),
            \'description\' => $article->get(\'description\') ?: $article->get(\'introtext\'),
            \'date\' => strftime(\'%d.%m.%Y\', strtotime($article->get(\'publishedon\'))),
        ]);
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
      'getServices' => 
      array (
        'fields' => 
        array (
          'id' => 2,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'getServices',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'cache_type' => 0,
          'snippet' => '$tpl = $modx->getOption(\'tpl\', $scriptProperties, \'serviceCard\');

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
    
    return $output;',
          'locked' => false,
          'properties' => 
          array (
          ),
          'moduleguid' => '',
          'static' => false,
          'static_file' => '',
          'content' => '$tpl = $modx->getOption(\'tpl\', $scriptProperties, \'serviceCard\');

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
      'generateBadges' => 
      array (
        'fields' => 
        array (
          'id' => 3,
          'source' => 1,
          'property_preprocess' => false,
          'name' => 'generateBadges',
          'description' => '',
          'editor_type' => 0,
          'category' => 1,
          'cache_type' => 0,
          'snippet' => '$output = \'\';
    foreach ($badges as $badgeText) {
        $output .= \'<div class="text-sm font-medium py-2 px-4 bg-white rounded-full">\'
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
          'content' => '$output = \'\';
    foreach ($badges as $badgeText) {
        $output .= \'<div class="text-sm font-medium py-2 px-4 bg-white rounded-full">\'
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
      'article_image' => 
      array (
        'fields' => 
        array (
          'id' => 4,
          'source' => 1,
          'property_preprocess' => false,
          'type' => 'image',
          'name' => 'article_image',
          'caption' => '',
          'description' => '',
          'editor_type' => 0,
          'category' => 2,
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