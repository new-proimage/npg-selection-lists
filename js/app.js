(function () {

  'use strict';
  window.NPG = Ember.Application.create({
    allItems: [
      {
        index: 1,
        val: 'apples'
      },
      {
        index: 2,
        val: 'oranges'
      },
      {
        index: 3,
        val: 'peaches'
      },
      {
        index: 4,
        val: 'strawberries'
      },
      {
        index: 5,
        val: 'plums'
      }
    ],
    chosenItems: [
      {
        index: 1,
        val: 'apples'
      },
      {
        index: 2,
        val: 'oranges'
      }
    ]
  });

  // Make override for the sake of hosting controller demonstration
  NPG.ApplicationController = Ember.Controller.extend({
    actions: {
      chosenItemChanged: function(selected, all) {
        console.log('swapping occurred');
      }
    }
  });

  NPG.SelectionListsComponent = Ember.Component.extend({

    selected: null,

    classNames: ['selection-lists'],

    columnBBinding: 'chosenItems',

    columnA: function() {
      var columnB = this.get('columnB'),
        availableItems = this.get('availableItems');

      return availableItems.filter(function (available) {
        return !columnB.find(function (item) {
          return JSON.stringify(item) === JSON.stringify(available);
        }, available);
      });

    }.property('availableItems.@each'),

    /**
     * Implements swap of the element from
     * column A to column B or vice versa
     * @param {string} target       Panel name of target
     * @param {string} destination  Panel name of destination
     * @param {number} index        Index of element in target panel
     */
    swap: function (target, destination, index) {
      var targetColumn = this.get(target),
          destColumn = this.get(destination),
          item = targetColumn[index];
      destColumn.pushObject(item);
      targetColumn.removeObject(item);
      this.sendAction('chosenItemChanged', this.get('chosenItems'));
    },

    /**
     * Panel View is the definition of the view that
     * represents left or right columns
     */
    PanelView: Ember.CollectionView.extend({
      // rewrite template property of itemViewClass in case of
      // rowRender is provided in the component constructor
      init: function () {
        var rowRender = this.get('parentView.rowRender');
        if (rowRender !== void 0) {
          this.get('itemViewClass').reopen({
            template: Ember.Handlebars.compile(rowRender)
          });
        }
        return this._super();
      },
      tagName: 'ul',

      dragOver: function (ev) {
        ev.preventDefault();
      },
      drop: function (ev) {
        var data = ev.dataTransfer.getData("Text").split('.'),
          panelName = this.get('panel');

        // drop is done over the same panel
        if (panelName === data[0]) {
          return false;
        }
        this.get('controller').swap(data[0], panelName, data[1]);
        return false;
      },
      itemViewClass: Ember.View.extend({
        tagName: 'li',
        defaultTemplate: Ember.Handlebars.compile('{{view.content}}'),
        classNameBindings: ['isSelected:selected'],
        attributeBindings: ['draggable'],
        draggable: 'true',
        isSelected: false,

        click: function(event) {
          var currentSelection = this.get('controller.selected');
          if (currentSelection) {
            currentSelection.toggleProperty('isSelected');
          }
          this.set('controller.selected', this);
          this.toggleProperty('isSelected');
        },

        dragStart: function (ev) {
          this.click();
          var panelName = this.get('parentView.panel'),
            column = this.get('controller.' + panelName),
            index = column.indexOf(this.get('content'));
          ev.dataTransfer.setData('Text', panelName + '.' + index);
        }
      })
    })
  });

}());
