**Please see the index.html file for full instructions and examples!**

AJAX-Content takes all the tedium out of making standard AJAX calls, automating the drudge-work - setting urls, spinners,
target zones, creating modals - and allowing the user several options for customisation.

Examples? Extracting content from another page to be placed into a modal on the current page is as as simple as:

$('#page-link a').ajax_content({
child_element: '#main',
trigger_event: 'click'
});

