
function random_element(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

/**
 * Selects an element of the appropriate category, and returns a jquery object
 * representing the text it contains.
 */
function element_for_category_member(category, source) {
	var phrase = random_element(source[category]);
	var $whole = $('<span>' + phrase.phrase.replace(/\$(\w+)/g,'<span>$1</span>') + '</span>');
	$whole.data('id', phrase.id);
	$whole.find('span').each(function() {
		var $this = $(this);
		$this.replaceWith(element_for_category_member($this.text(), source));
	});
	return $whole;
}

function fill_template(template, source) {
	var input = "";
	var result = template;
	while(result != input) {
		input = result;
		result = input.replace(/\$\w+/g, function(type) {
			var substitute = source[type.substring(1)];
			return '<span class="' + type.substring(1) + '">' + random_element(substitute).phrase + '</span>';
		});
	}
	return result;
}

function set_description(items) {
	var $descriptionContents = element_for_category_member('template', items);
	var $descriptionContainer = $('#description');

	$descriptionContainer.empty();
	$descriptionContainer.append($descriptionContents);
	var words = document.getElementsByTagName('span');
	for(var i = 0; i < words.length; i++) {
		words[i].onclick = function(ev) {
			var theSpan = this;
			theSpan.style.display = "none";
			var input = document.createElement('input');
			input.type = 'text';
			input.value = theSpan.innerText;
			input.style.width = measureText(theSpan.innerText);

			function hideEditor() {
				if(input.value !== '' && input.value !== theSpan.innerText) {
					theSpan.innerText = input.value;

					$.post("/phrases/" + theSpan.className, {
						'content': input.value
					});
				}
				theSpan.style.display = "inline";
				input.parentNode.removeChild(input);
			}
			input.onblur=hideEditor;
			input.onkeydown = function(ev) {
				if(ev.which == 13 || ev.keyCode == 13) {
					hideEditor();
				}
			};

			this.parentNode.insertBefore(input, theSpan);
			input.focus();
			input.select();
			ev.stopPropagation();
		};
	}
	return false;
}

function measureText(text)
{
	var test = document.getElementById("MeasureText");
	test.innerText = text;
	return (test.clientWidth + 1) + "px";
}

function set_description_from_server() {
	$.get('/template-data', function(data) {
		set_description(data);
	});
	return false;
}

$(function() {
	$('.description').on('mouseover', 'span', function(ev) { $(this).addClass('hover'); ev.stopPropagation()});
	$('.description').on('mouseout', 'span', function(ev) {$(this).removeClass('hover')});

	$('#see-more').click(set_description_from_server);
	set_description_from_server();

});
