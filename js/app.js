(function () {

  'use strict';
  window.NPG = Ember.Application.create({
    allItems: ['apples', 'oranges', 'peaches', 'strawberries', 'plums'],
    chosenItems: ['strawberries', 'apples']
  });

  // Make override for the sake of hosting controller demonstration
  NPG.ApplicationController = Ember.Controller.extend({
    actions: {
      chosenItemChanged: function(selected) {
        console.log('swapping occurred');
      }
    }
  });

  NPG.ListToListComponent = Ember.Component.extend({

    selected: null,

    init: function(){
      this._super();
      // make massage to the data to remove chosen items
      // from all available in order prepare data source for
      // column A
      var chosenItems = this.get('chosenItems'),
          availableItems = this.get('availableItems'),
          i = 0,
          leni = chosenItems.length,
          index;
      for (i; i < leni; i +=1) {
        index = availableItems.indexOf(chosenItems[i]);
        if (index > -1) {
          availableItems.splice(index, 1);
        }
      }
    },

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
        ev.preventDefault()
      },
      drop: function (ev) {
        var data = ev.dataTransfer.getData("Text").split('.'),
          panelName = this.get('panel');

        // drop is done over the same panel
        if (panelName === data[0]) {
          return false;
        }

        return this.get('controller').swap(data[0], panelName, data[1]);
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
