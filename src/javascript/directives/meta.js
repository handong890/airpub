airpub.directive('meta', function($upyun, $timeout) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, iElement, iAttrs, ctrl) {
      var $ = angular.element;
      // add class
      $(iElement).addClass('editor');
      // check if lepture's editor class exists
      if (!window.Editor) return false;
      // init editor instance
      window.editor = new Editor({
        toolbar: [
          {name: 'bold', action: Editor.toggleBold},
          {name: 'italic', action: Editor.toggleItalic},
          '|',
          {name: 'quote', action: Editor.toggleBlockquote},
          {name: 'unordered-list', action: Editor.toggleUnOrderedList},
          {name: 'ordered-list', action: Editor.toggleOrderedList},
          '|',
          {name: 'link', action: Editor.drawLink},
          {name: 'image', action: Editor.drawImage},
          {name: 'upload', action: uploadAndDrawImage},
          {name: 'fullscreen', action: Editor.toggleFullScreen}
        ]
      });
      editor.render();
      editor.codemirror.on('change', onChange);

      // upyun configs
      $upyun.set('bucket','upyun-form');
      $upyun.set('form_api_secret', 'IRoTyNc75husfQD24cq0bNmRSDI=');

      // model => view
      ctrl.$render = function() {
        if (!editor) return;
        editor.codemirror.setValue(
          ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue
        );
      };

      // view => model
      function onChange() {
        ctrl.$setViewValue(editor.codemirror.getValue());
      }

      // upload images and fill uri
      function uploadAndDrawImage() {
        var uploading = false;
        var cm = editor.codemirror;
        var stat = editor.getState(cm);
        if (!$upyun) {
          return editor._replaceSelection(cm, stat.image, 
            '![', '](http://)' // uri to be filled.
          );
        }
        if (!document.getElementById('fileUpload')) {
          var hiddenInputFile = document.createElement('input');
          hiddenInputFile.id = 'fileUpload';
          hiddenInputFile.type = 'file';
          hiddenInputFile.name = 'file';
          hiddenInputFile.style.display = 'none';
          $(iElement).after(hiddenInputFile);
        }
        // trigger click
        var inputButton = document.getElementById('fileUpload');
        inputButton.click();
        // begin upload
        $(inputButton).on('change', function(eve) {
          if (uploading) return;
          uploading = true;
          $upyun.upload(iAttrs.formName, function(err, response, image){
            uploading = false;
            if (err) return console.error(err);
            var uploadOk = image.code === 200 && image.message === 'ok';
            if (!uploadOk) return;
            editor._replaceSelection(cm, stat.image, 
              '![', '](' + image.absUrl + ')' // uri to be filled.
            );
          });
        });
      }
    }
  }
});