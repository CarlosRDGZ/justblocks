
ClassicEditor.create(document.querySelector('#description'), {
	plugins: [ Essentials, Paragraph, Bold, Italic ],
	toolbar: ['heading','|','bold','italic','link','bulletedList','numberedList','blockQuote','undo','redo'],
}).then(editor => window.editor = editor)