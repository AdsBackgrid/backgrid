var PopCellEditor = Backgrid.PopCellEditor = Backgrid.CellEditor.extend({
  className: "pop-editor",

  events: {
    "click .save": "onSave",
    "click .cancel": "onCancel",
    "click": "onClick"
  },

  isPopup: true,

  initialize: function (options) {
    Backgrid.PopCellEditor.__super__.initialize.apply(this, arguments);
    var cancelEdit = this.cancelEdit = this.cancelEdit.bind(this);
    // This view maybe create in the click event listener, if we don't
    // delay the observation, the click event will bubble to the window and
    // the cancelEdit listener will be invoked, but that is not what I want,
    // so I put the `addEventListener` into the setTimeout to delay the observation.
    setTimeout(function() {
      window.addEventListener('click', cancelEdit);
    }, 0);
  },

  render: function() {
    var model = this.model;
    var input = $('<input class="value" type="text">');
    var saveButton = $('<input class="save" type="button" value="Save">');
    var cancelButton = $('<input class="cancel" type="button" value="Cancel">');
    input.val(this.formatter.fromRaw(model.get(this.column.get("name")), model));
    this.$el.append(input);
    this.$el.append(saveButton);
    this.$el.append(cancelButton);
    return this;
  },

  onSave: function (event) {
    var model = this.model, column = this.column;
    var newValue = this.formatter.toRaw(this.$('.value').val(), this.model);
    if (_.isUndefined(newValue)) {
      model.trigger("backgrid:error", model, column, val);
    } else {
      model.set(column.get("name"), newValue);
      model.trigger("backgrid:edited", model, column, new Backgrid.Command({keyCode: 13}));
    }
    event.stopPropagation();
  },

  onCancel: function(event) {
    event.stopPropagation();
    this.cancelEdit();
  },

  onClick: function(event) {
    event.stopPropagation();
  },

  cancelEdit: function() {
    var model = this.model, column = this.column;
    model.trigger("backgrid:edited", model, column, new Backgrid.Command({keyCode: 27}));
  },

  remove: function() {
    Backgrid.PopCellEditor.__super__.remove.call(this);
    window.removeEventListener('click', this.cancelEdit);
  }
});
