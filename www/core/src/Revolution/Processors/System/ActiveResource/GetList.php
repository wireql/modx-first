<?php

/*
 * This file is part of MODX Revolution.
 *
 * Copyright (c) MODX, LLC. All Rights Reserved.
 *
 * For complete copyright and license information, see the COPYRIGHT and LICENSE
 * files found in the top-level directory of this distribution.
 */

namespace MODX\Revolution\Processors\System\ActiveResource;

use MODX\Revolution\Formatter\modManagerDateFormatter;
use MODX\Revolution\modResource;
use MODX\Revolution\modUser;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOObject;
use xPDO\Om\xPDOQuery;

/**
 * Gets a list of active resources
 * @param integer $start (optional) The record to start at. Defaults to 0.
 * @param integer $limit (optional) The number of records to limit to. Defaults to 10.
 * @param string $sort (optional) The column to sort by. Defaults to name.
 * @param string $dir (optional) The direction of the sort. Defaults to ASC.
 * @param string $dateFormat (optional) The datetime format to format the editedon date to.
 * Defaults to the manager's combined date, separator, and time format settings.
 * @package MODX\Revolution\Processors\System\ActiveResource
 */
class GetList extends GetListProcessor
{
    public $classKey = modResource::class;
    public $languageTopics = ['resource'];
    public $permission = 'view_document';
    public $defaultSortField = 'editedon';
    public $defaultSortDirection = 'DESC';

    private modManagerDateFormatter $formatter;

    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return $this->modx->hasPermission('view_document');
    }

    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return ['resource'];
    }

     /**
     * {@inheritDoc}
     * @return boolean
     */
    public function initialize()
    {
        $initialized = parent::initialize();
        $this->formatter = $this->modx->services->get(modManagerDateFormatter::class);
        $this->setDefaultProperties([
            'dateFormat' => '',
        ]);
        return $initialized;
    }

    /**
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $c->innerJoin(modUser::class, 'EditedBy');
        $c->where([
            'deleted' => 0,
            'editedon:!=' => null,
        ]);
        return $c;
    }

    /**
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->select($this->modx->getSelectColumns(modResource::class, 'modResource'));
        $c->select($this->modx->getSelectColumns(modUser::class, 'EditedBy', '', ['username']));
        return $c;
    }

    /**
     * @param xPDOObject $object
     * @return array|mixed
     */
    public function prepareRow(xPDOObject $object)
    {
        $objectArray = $object->get([
            'id',
            'pagetitle',
            'editedon',
            'username',
        ]);
        $customFormat = $this->getProperty('dateFormat');
        $editedOn = $object->get('editedon');
        $objectArray['editedon'] =  !empty($customFormat)
            ? $this->formatter->format($editedOn, $customFormat)
            : $this->formatter->formatDateTime($editedOn)
            ;

        return $objectArray;
    }
}
