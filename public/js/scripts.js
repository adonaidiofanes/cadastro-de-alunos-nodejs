$( document ).ready(function() {
	var url = window.location.href;
	
	if( (url.indexOf('alunos/editar') > -1) || 
		(url.indexOf('alunos/form') > -1) 
	){
		var idEditar = url.split("=")[1];
		carregarListaCursos(idEditar);
	} 

	function carregarListaCursos(id){
		$.getJSON("/listarCursos/" + id,
			function(data){
				montarPainelCursos(data.todosCursos);
				marcarSelecionados(data.cursosSelecionados);
			},
			function(jqXHR, textStatus, errorThrown) {
			    alert('error ' + textStatus + " " + errorThrown);
			}
		);
	}

	function marcarSelecionados(json){
		$.each(json, function(i, value){
			$("#painelCursos").find('[id="'+value.idCurso+'"]').attr('checked','checked');
		});
	}

	function montarPainelCursos(json){
		var tpl = '<li class="list-group-item"> <span>{{nomeCurso}}</span> <div class="material-switch pull-right"> <input id="{{id}}" name="cbCursos[]" value="{{id}}" type="checkbox"> <label for="{{id}}" class="label-success"></label> </div> </li>';
		$.each(json, function(i, value) {
			var aux = tpl.replace("{{nomeCurso}}", value.titulo).replace(/{{id}}/g, value.id);
			$("#painelCursos").append(aux);
		});
	}

	/* Buscar curso
	   Funcao responsavel por criar um filtro na busca de cursos
	*/
	$('#buscarCurso').keyup(function(e) {
		var val = this.value;
		
		if(val == ""){ 
			$('#painelCursos li').removeClass('hidden'); 
			return;
		}

		var $items = $('#painelCursos li');

		var $newItems = $items.each(function(i, item) {

			if (!val || $(item).text().toLowerCase().indexOf(val.toLowerCase()) === -1) {
				$(item).addClass('hidden');
			} else {
				$(item).removeClass('hidden');
			}

		})
	});

	/*
		Inputs multiplos
		Fonte: https://bootsnipp.com/snippets/featured/multiple-fields
	*/
        var addFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');
            var $formGroupClone = $formGroup.clone();

            $(this)
                .toggleClass('btn-default btn-add btn-danger btn-remove')
                .html('–');

            $formGroupClone.find('input').val('');
            $formGroupClone.insertAfter($formGroup);

            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            if ($multipleFormGroup.data('max') <= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', true);
            }
        };

        var removeFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');

            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            if ($multipleFormGroup.data('max') >= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', false);
            }

            $formGroup.remove();
        };

        var countFormGroup = function ($form) {
            return $form.find('.form-group').length;
        };

        $(document).on('click', '.btn-add', addFormGroup);
        $(document).on('click', '.btn-remove', removeFormGroup);


});