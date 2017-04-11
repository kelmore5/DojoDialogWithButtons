require(['dojo/aspect', 'dijit/form/Button', 'dijit/Dialog', "dojo/_base/window", "dojo/dom-style"],
    function(aspect, Button, Dialog, win, domStyle) {

        /**
         * Extends dijit dialog to include options for an ok and cancel button
         * Also adds functionality to include an event on the ok button
         */
        lang.extend(Dialog, {
            addOkButton: false,

            addOkButtonFunction: null,

            addCancelButton: false,

            postCreate: function () {
                domStyle.set(this.domNode, {
                    display: "none",
                    position: "absolute"
                });
                win.body().appendChild(this.domNode);

                this.inherited("postCreate", arguments);

                this.connect(this, "onExecute", "hide");
                this.connect(this, "onCancel", "hide");
                this._modalconnects = [];

                if (this.addOkButton || this.addCancelButton) {
                    var dialog = this.id;

                    dojo.create("div", {
                            id: dialog + "buttonContainer",
                            style: {
                                "background-color": "#EFEFEF", "border-top": "1px solid #d3d3d3",
                                padding: "3px 5px 2px 7px", "text-align": "center"
                            }
                        },
                        this.containerNode, "after");

                    if (this.addOkButton) {
                        var button = new Button({
                            label: "OK",
                            onClick: function () {
                                dijit.byId(dialog).destroy();
                            }
                        }).placeAt(this.id + "buttonContainer", "last");

                        if (this.addOkButtonFunction != null) {
                            var listener = null;
                            listener = aspect.after(button, "onClick", this.addOkButtonFunction);

                            var listener2 = null;
                            listener2 = aspect.after(button, "onClick", function () {
                                if (listener != null) {
                                    listener.remove();
                                }
                                else {
                                    listener2.remove();
                                }
                            });
                        }
                    }

                    if (this.addCancelButton) {
                        new Button({
                            label: "Return",
                            onClick: function () {
                                dijit.byId(dialog).destroy();
                            }
                        }).placeAt(this.id + "buttonContainer", "last");
                    }
                }
            },
        });
    }
);
