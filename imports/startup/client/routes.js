import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
//import { AccountsTemplates } from 'meteor/useraccounts:core';

// Import to load these templates
import '../../ui/mainLayout.js';
import '../../ui/home.js';
import '../../ui/resourcePage.js';
import '../../ui/newentry.js';

FlowRouter.route('/', {
	action: function() {
		BlazeLayout.render("mainLayout", {content: "home"});
	}
});

FlowRouter.route('/resourcePage/:_id', {
	action() {
		BlazeLayout.render("mainLayout", {content: "resourcePage"});
	}
	// /:resourceId
});

FlowRouter.route('/newentry.html', {
	action: function() {
		BlazeLayout.render("mainLayout", {content: "newentry"});
	}
});