sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.i027737.Node.controller.App", {
		
		onSendPressed: function(oEvent){
			
			var chatbot = this.getView().byId("brianchat");
			var question = oEvent.getParameter("text");
			
			var payload = {
				content: question
			};
			
			jQuery.ajax({
				url: "/chat",
				cache: false,
				type: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					
				},
				data: JSON.stringify(payload),
				async: true,
				success: function(sData) {
					
					chatbot.addChatItem(sData.content, false);           
					
				},
				error: function(sError) {
					
					chatbot.addChatItem("Sorry im malfunctioning", false);      
				}
			});
			
		}

	});
});