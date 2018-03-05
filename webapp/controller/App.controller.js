sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("i027737Controls.controller.App", {
			
		onSendPressed: function(oEvent){
			var question = oEvent.getParameter("text");
			
			//Here is where we need to call the server and get a response to our question
			
			var response = "Sorry, u want what.. WTF";
			
			var chatbot = this.getView().byId("brianchat");
			chatbot.addChatItem(response, false);                        
		}
			
	});
});