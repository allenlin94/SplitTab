/* Page One Script */

$('#new_person_btn').click(function(){
	$("#person_list").append('<div class="person"><input type="text" class="person_name" placeholder="Name" maxLength="10" value=""><span id="remove_btn" class="glyphicon glyphicon-remove-sign" style="color:red;" aria-hidden="true" role="button"></span><br><br></div>');
	$("#person_list :last-child input").focus();

});

$(document).on('click', '#remove_btn', function(){
	$(this).parent().remove();
});

//warning message generator
function warningMessage(str) {

	var warning = document.createElement("div");
	warning.className = "warning";
	var message = document.createElement("div");
	var message = '<div class = "message">'+str+'</str>';
	
	message.className = "message";
	warning.innerHTML = message;
	warning.innerHTML += '<button type = "button" class = "ok_btn">OK</button>';
	
	return warning;
}



//Warning Message Handle
$(document).on('click', ".ok_btn", function(){
	$(this).parent().remove();
	$('#wrapper').removeClass('setOpacity');

	if ($(this).parent().text()==="missing participants name!OK") {
		//Focus on missing participant name
		focusPerson();
	}
	else {
		$('#restaurant_name').focus();
	}
});

var names = [];
$('#done_btn').click(function(){
	var emptyList = checkPerson();
	if((!$('#restaurant_name').val()) && (emptyList)){
		$('body').append(warningMessage("missing restaurant & participants name!"));
		$('#wrapper').addClass('setOpacity');
	}
	else if(!$('#restaurant_name').val()){
		$('body').append(warningMessage("missing restaurant name!"));
		$('#wrapper').addClass('setOpacity');
	}
	else if (emptyList){
		$('body').append(warningMessage("missing participants name!"));
		$('#wrapper').addClass('setOpacity');	
	}
	else{
		$('.bodyBox').css('display','none');
		$('#addExpenseRecipt').css('display','block');
		$('#restaurant').html( $('#restaurant_name').val());

			//Alphabetize list
			$("#person_list .person_name").each(function() {
				names.push($(this).val());
			})			
			names.sort();
		}
	});

//Checks if #person_list is empty or if there is an empty variable
function checkPerson() {
	var count = 0;
	var isEmpty = false;
	$("#person_list .person_name").each(function() {
		count++;
		if ($(this).val().length===0) {
			isEmpty = true;
		}
	})
	if (count===0) {
		isEmpty = true;
	}
	return isEmpty;
}

//Finds the first input with missing participants and focus
function focusPerson(){
	$("#person_list .person_name").each(function() {
		if ($(this).val().length===0) {
			$(this).focus();
			return false;
		}
	})
}


/* Page Two Script */

$(document).on('focus','input', function(){
	//turn off auto complete
	$('input').attr('autocomplete','off');
	$("#footer").addClass("hideFooter");
});

$(window).click(function() {
	$('table tbody tr').removeClass("selected");
	$('ul.list.displayList').removeClass('displayList');
	if(!$('input').is(":focus")){
		setTimeout(function(){
			$("#footer").removeClass('hideFooter');	
		}, 500);
		
	}
});



//Add Expense Function
$(document).on('click', "#add_expense_btn", function(){

	var select_div = document.createElement('div');
	select_div.className = "select_btn";
	select_div.innerHTML = "Select";
	var select = document.createElement('div');
	var list = document.createElement('ul');
	list.className = "list";

	for(i=0; i<names.length; i++){

		var listItem = document.createElement('li');
		var input = document.createElement('input');
		input.type = "checkbox";
		input.value = names[i];
		listItem.appendChild(input);
		listItem.innerHTML += names[i];
		list.appendChild(listItem);
	}	

	list.style.display = "none";
	select.appendChild(list);
	$(select).after(select_div);

	var select_text = select_div.outerHTML + select.outerHTML;

	$("#myTable tbody").append(
		'<tr><td><input type="text" class="expense" placeholder="Burger" value=""></td>'
		+	
		'<td><input type="number" class="price" placeholder="1.99" min="0" step="0.01" onchange="calculateAll()" value=""></td>'
		+
		'<td class="listName">' 			
		+
		select_text
		+
		'</td></tr>'
		);
});

//Updates input value. Necessary for Page Three
$(document).on('change', ".expense, .price", function() {
	var x = $(this).val();
	$(this).parent().val(x);
})

$(document).on('click', ".select_btn", function(){
	$(this).next().children().toggleClass("displayList");
});

$(document).on('change', 'input[type=checkbox]', function() {
	if (this.checked) {
		if($(this).parent().parent().parent().prev().text() == "Select"){
			$(this).parent().parent().parent().prev().text("");
		}
		var selectedParticipant = '<span title="'+ $(this).val() + '">' + $(this).val()+ " " + '</span>';
		$(this).parent().parent().parent().prev().append(selectedParticipant);	
	}
	else{
		$($(this).parent().parent().parent().parent().find('span[title="'+$(this).val()+'"]')).remove();
        if($(this).parent().parent().parent().prev().text()==""){
            $(this).parent().parent().parent().prev().text("Select");
        }
	}
});

/* Tfoot Calculations */ 

$(document).on('change', '#tax, #tip', function(){
	var tax = $('#tax').val();
	var tip = $('#tip').val();
	var subtotal = $('#subtotal').text();

	var taxPercent = tax / subtotal * 100;
	taxPercent = taxPercent.toFixed(3);
	var tipPercent = tip / subtotal * 100;
	tipPercent = tipPercent.toFixed(2);

	$("#taxPercent").val(taxPercent);
	$("#tipPercent").val(tipPercent);

});

//Calculates all four rows of tfoot
function calculateAll() {
	calculateSum();
	calculateTax();
	calculateTip();
	calculateGrandTotal();	
}

//Calculates the sum of tbody
function calculateSum() {
	var sum=0;

	$(".price").each(function() {
		var value = $(this).val();
		if (!isNaN(value) && value.length !=0) {
			sum += parseFloat(value);
		}
	})
	sum = sum.toFixed(2);
	$('#subtotal').text(sum);
}

//Takes the tax percent and multiplying it with total sum
function calculateTax() {
	var result = $('#subtotal').text();
	var tax = $('#taxPercent').val();

	var totalTax = result * (tax * 0.01);
	totalTax = totalTax.toFixed(2);

	$('#tax').val(totalTax);
}

//Takes the tip percent and multiplies it with the total sum
function calculateTip() {
	var result = $('#subtotal').text();
	var tip = $('#tipPercent').val();

	var totalTip = result * (tip * 0.01);
	totalTip = totalTip.toFixed(2);

	$('#tip').val(totalTip);
}

//Adds total sum, tax and tip to get grand total
function calculateGrandTotal() {
	var result = parseFloat($('#subtotal').text());
	var tax = parseFloat($('#tax').val());
	var tip = parseFloat($('#tip').val());

	var total = result + tax + tip;
	total = '$' + total.toFixed(2);

	$('#grandTotal').text(total);
}

function deleteRow() {
	$('.selected').remove();

	if ($(".selected").length == 0) {
		$('#remove_expense_btn').prop("disabled", true);
	}
	calculateAll();
}

/*  On doubleclick, selects tr, assigns it class selected and highlights row red
	If table row is selected, #remove_expense_btn is disabled. Otherwise, disabled*/

$(document).on('click', 'table tbody tr', function(event){
	event.stopPropagation();
	var currentRow = $(this).index();
	$(this).parent().find("tr").each(function(){
		if($(this).index()!= currentRow){
			$(this).find("td").next().next().find("ul").removeClass("displayList");	
		}
	});
	//Already selected
	if ($(this).hasClass('selected')) {
	}
	//first time being selected
	else {
		$('#remove_expense_btn').prop("disabled", false);
		$('.selected').removeClass('selected');
		$(this).addClass("selected");
	}	

	if ($(".selected").length == 0) {
		$('#remove_expense_btn').prop("disabled", true);
	}
});

$('#expense_done_btn').click(function(){

	$('.bodyBox').css('display','none');
	$('#individualRecipt').css('display','block');

	var select = document.createElement('select');
	select.id = "individualList";
	for(i=0; i<names.length; i++){
		
		var option = document.createElement('option');
		option.value = names[i];
		option.innerHTML = names[i];
		select.appendChild(option);
	}
	var select_text = select.outerHTML;

	$("#individualRecipt").prepend(select_text);
	populateIndividualTable();
	$("#ind_tax_percent").text($('#taxPercent').val());
	$("#ind_tip_percent").text($('#tipPercent').val());
});

/* Page Three Script */

$(document).on('change', "#individualList", function(){
	$("#individualTable tbody").empty();
	populateIndividualTable();	
});

function populateIndividualTable() {
	var selected = $("#individualList :selected").text().trim();
	$("#myTable tbody tr .listName").children().each(function(i, tr) {

		if ($(this).is(':first-child')) {

			$(this).children().each(function() {

				var x = $(this).text().trim();
				if (selected===x) {

					var count = $(this).parent().children().length;

					var expense = $(this).parent().parent().parent().children().eq(0).val();
					var price = $(this).parent().parent().parent().children().eq(1).val();
					price = price / count;
					price = price.toFixed(2);

					$("#individualTable tbody").append('<tr><td>'
						+ expense + '</td><td class="ind_price">'
						+ price + '</td></tr>');
				}	
			})
		}
	});

	ind_calculateAll();
}

/* Third Page Tfoot Calculation */ 
//Calculates all four rows of tfoot
function ind_calculateAll() {
	ind_calculateSum();
	ind_calculateTax();
	ind_calculateTip();
	ind_calculateGrandTotal();
}

//Calculates the sum of tbody
function ind_calculateSum() {
	var sum=0;

	$(".ind_price").each(function() {
		var value = $(this).html();
		if (!isNaN(value) && value.length !=0) {
			sum += parseFloat(value);
		}
	})
	sum = sum.toFixed(2);

	$('#ind_subtotal').text(sum);
}

//Takes the tax percent and multiplying it with total sum
function ind_calculateTax() {
	var result = $('#ind_subtotal').text();
	var tax = $('#taxPercent').val();

	var totalTax = result * (tax * 0.01);
	totalTax = totalTax.toFixed(2);

	$('#ind_tax').text(totalTax);
}

//Takes the tip percent and multiplies it with the total sum
function ind_calculateTip() {
	var result = $('#ind_subtotal').text();
	var tip = $('#tipPercent').val();

	var totalTip = result * (tip * 0.01);
	totalTip = totalTip.toFixed(2);

	$('#ind_tip').text(totalTip);
}

//Adds total sum, tax and tip to get grand total
function ind_calculateGrandTotal() {
	var result = parseFloat($('#ind_subtotal').text());
	var tax = parseFloat($('#ind_tax').text());
	var tip = parseFloat($('#ind_tip').text());

	var total = result + tax + tip;
	total = '$' + total.toFixed(2);

	$('#ind_grandTotal').text(total);
}

$(document).on('click', '#back_btn', function(){
	//$('.bodyBox').css('display','block');
	$("#individualList").remove();
	$("#individualTable tbody").empty();
	$('#addExpenseRecipt').css('display','block');
	$('#individualRecipt').css('display','none');
});