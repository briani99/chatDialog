sap.ui.define(
  [	"sap/ui/core/Control",
	"sap/m/Button",
	"sap/ui/core/IconPool",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/FeedListItem",
	"sap/m/FeedInput",
	"sap/m/ResponsivePopover",
	"sap/m/VBox",
	"sap/m/ScrollContainer",
	"sap/m/Bar",
	"sap/m/Title"
  ],
  function(Control, Button, IconPool, Dialog, List, FeedListItem, FeedInput, ResponsivePopover, VBox, ScrollContainer, Bar, Title) {
	var ChatDialog = Control.extend("i027737Controls.controls.ChatDialog",{
		
		metadata : {
			properties : {
				title: {type: "string", group: "Appearance", defaultValue: null},
			    
			    width: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},
				height: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},
			    
			    buttonIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				robotIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				userIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				
				initialMessage: {type: "string", group: "Appearance", defaultValue: "Hello, How can I help?"},
				placeHolder: {type: "string", group: "Appearance", defaultValue: "Post something here"}
			
			},
			aggregations : {
				_chatButton:  {type: "sap.m.Button", multiple: false},
				_popover: {type: "sap.m.ResponsivePopover", multiple: false}
				
			},
			events : {
				send: {
            		parameters : {
						text : {type : "string"}
					}
            	}
			}
		},
    	
    	
    	init : function () {
    		
    		//initialisation code, in this case, ensure css is imported
	        var libraryPath = jQuery.sap.getModulePath("i027737Controls"); 
	        jQuery.sap.includeStyleSheet(libraryPath + "/css/bkChat.css"); 
			
			var oBtn = new Button(this.getId() + "-bkChatButton", {
				press: this._onOpenChat.bind(this)
			});
			this.setAggregation("_chatButton", oBtn);
			
			var oHeader = new Bar({
				contentMiddle: new Title(this.getId() + "-bkChatTitle", {}),
				contentRight: new Button({
					icon: "sap-icon://pushpin-off",
					press: this._toggleAutoClose.bind(this)
				})
			});
			
			var oRpop = new ResponsivePopover(this.getId() + "-bkChatPop", {
				customHeader: oHeader,
				placement: "Top",
				showHeader: true,
				resizable: true,
				horizontalScrolling: false,
				verticalScrolling: false
			}).addStyleClass("sapUiTinyMargin");
			
			this.setAggregation("_popover", oRpop);
			
			var oFeedIn = new FeedInput(this.getId() + "-bkChatInput", {
				post: this._onPost.bind(this),
				showicon: true
			}).addStyleClass("sapUiTinyMargin");
			
			oFeedIn.addEventDelegate({
    			onsapenter: function(oEvent) {
    				var sTxt = oFeedIn.getValue(); 
    				oFeedIn.fireEvent("post", {
						value: sTxt
					});
					oFeedIn.setValue(null); 
			    }
			});
			
			var oFeedList = new List(this.getId() + "-bkChatList", {
				growing: true,
				height: "100%",
				showSeparators: "None",
				items: this.getAggregation("_feedListItem")
			});
			
			
			var oInitialFeedListItem = new FeedListItem(this.getId() + "-bkChatInitial", {
				showicon: true,
				text: "Hello I'm Ro Bot, how can i help you?"
			});
			oInitialFeedListItem.addStyleClass("bkRobotInput");
			oFeedList.addItem(oInitialFeedListItem);
			
			var oScroll = new ScrollContainer(this.getId() + "-bkChatScroll", {
				height: "100%",
				horizontal: false,
				vertical: true,
				focusable: true
			});
			
			oScroll.insertContent(oFeedList);
			
			var oVBox = new VBox({
				height: "100%",
				items: [oScroll, oFeedIn],
				fitContainer: true,
				justifyContent : "End",
            	alignItems : "Stretch"
			});
			
			oRpop.insertContent(oVBox, 0);
		},
    	
    	renderer  : function(oRm, oControl) {
    		
			var oChatBtn = oControl.getAggregation("_chatButton");
			var oPop = oControl.getAggregation("_popover");
			
			oRm.write("<div ");
			oRm.addClass("bkChatButton");
			oRm.writeClasses();
			oRm.write(">");
			
			oRm.renderControl(oChatBtn);
			oRm.renderControl(oPop);
			oRm.write("</div>");
		
		},
		
		onAfterRendering: function(args) {
            if(sap.ui.core.Control.prototype.onAfterRendering) {
             sap.ui.core.Control.prototype.onAfterRendering.apply(this,args);
            }
        },
        
        setTitle: function(sTitle){
        	this.setProperty("title", sTitle, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatTitle").setText(sTitle);
        },
        
        // setHeight: function(sHeight){
        // 	this.setProperty("height", sHeight, true);
        // 	this.getAggregation("_popover").setContentHeight(sHeight);
        // },
        
        // setWidth: function(sWidth){
        // 	this.setProperty("width", sWidth, true);
        // 	this.getAggregation("_popover").setContentHeight(sWidth);
        // },
        
        setUserIcon: function(sUserIcon){
        	this.setProperty("userIcon", sUserIcon, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInput").setIcon(sUserIcon);
        },
        
        setRobotIcon: function(sRobotIcon){
        	this.setProperty("robotIcon", sRobotIcon, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setIcon(sRobotIcon);
        },
        
        setButtonIcon: function(sButtonIcon){
        	this.setProperty("buttonIcon", sButtonIcon, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatButton").setIcon(sButtonIcon);
        },
        
        setInitialMessage: function(sText){
        	this.setProperty("initialMessage", sText, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setText(sText);
        },
        
        setPlaceHolder: function(sText){
        	this.setProperty("placeHolder", sText, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInput").setPlaceholder(sText);
        },
        
        _onPost: function(oEvent){
        	
			var sText = oEvent.getSource().getValue();
			this.addChatItem(sText, true);
			this.fireEvent("send", {
				value: sText
			}, false, true);
        	
        },
        
        _onOpenChat: function(oEvent){
        	this.getAggregation("_popover").openBy(this.getAggregation("_chatButton"));
        },
        
        _toggleAutoClose: function(oEvent){
       
        	var bAuto = this.getAggregation("_popover").getAggregation("_popup").oPopup.getAutoClose();
        	if(bAuto){
        		oEvent.getSource().setProperty("icon", "sap-icon://pushpin-on");
        		this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(false);
        		
        	}else {
        		oEvent.getSource().setProperty("icon", "sap-icon://pushpin-off");
        		this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(true);
        	}
        },
        
        addChatItem: function(sText, bUser){
        	
        	var oFeedListItem = new FeedListItem({
				showicon: true,
				text: sText
			});
			
			if(bUser){
				oFeedListItem.setIcon(this.getUserIcon());
				oFeedListItem.addStyleClass("bkUserInput");
			}else{
				oFeedListItem.setIcon(this.getRobotIcon());
				oFeedListItem.addStyleClass("bkRobotInput");
			}
			sap.ui.getCore().byId(this.getId() + "-bkChatList").addItem(oFeedListItem, 0);
			
			var scrollToInput = document.getElementById(oFeedListItem.getId());
			sap.ui.getCore().byId(this.getId() + "-bkChatScroll").scrollTo(0, 1000, 0);
			
			//sap.ui.getCore().byId(this.getId() + "-bkChatScroll").scrollToElement(scrollToInput);
			
			
        },
 
        
	});

	  
	  return ChatDialog;
});

