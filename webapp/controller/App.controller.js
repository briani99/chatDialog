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

			var _id = localStorage.getItem("chatId");
			if (_id != undefined){
				payload.id = _id;
			}
			
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
					localStorage.setItem("chatId", sData.id);
					
				},
				error: function(sError) {
					
					chatbot.addChatItem("Sorry im malfunctioning", false);      
				}
			});
			
		}

	});
});