<?php  return '$output = \'\';
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
    
    return $output;
return;
';