var tables = {};

const lin = e => {
  e.target.classList.forEach(c => {
    if(c!=="selected") {
      $(`.${c}`).addClass("highlighted");
    }
  });
};

const lout = e => {
  e.target.classList.forEach(c => 
    $(`.${c}`).removeClass("highlighted")
  );
};

const lclick = e => {
  var row;
  e.target.classList.forEach(c => { 
    if (c.startsWith("multr")) {
      row = +c.substr(5)
    }});
  if(!tables[row]) {
    tables[row] = {selected:false};
  }
  tables[row].selected = !tables[row].selected;
  $(`.multr${row}`).toggleClass("selected", tables[row].selected);
  updateSelection();
};

const invert = e => {
  Object.keys(tables).map(k=>tables[k])
    .forEach(r => r.selected = !r.selected);
  updateSelection();
};

const all = e => {
  Object.keys(tables).forEach(k => tables[k].selected = true);
  updateSelection();
};

function updateSelection() {
  var selected = getSelected();
  selected.forEach(k => $(`.multr${k}`).addClass("selected"));
  Object.keys(tables)
    .filter(k => !tables[k].selected).forEach(k => $(`.multr${k}`).removeClass("selected"));;
  $("#selected").text(`[${selected.join()}]`);
  $("#play").prop("disabled", selected.length === 0);
}

function getSelected() {
  return Object.keys(tables).filter(k => tables[k].selected);
}

$(function() {
  $("#invert").click(invert);
  $("#all").click(all);
  $("#play").click(e => play(getSelected()));
  $("#stop").click(stop);
  
  var table = $("#table");
  var i,j;
  var row = $("<tr></tr>")
  var th = $(`<th class="diag selectable">x</th>`);
  th.hover(lin,lout);
  row.append(th);
  for(j=1; j<=12; j++) {
    var th = $(`<th class="multc${j}"> ${j}</th>`)
    th.hover(lin, lout);
    row.append(th);
  }
  table.append(row);
  
  for(i = 1; i <= 12; i++) {
    row = $("<tr></tr>")
    tables[i] = {selected:false};
    th = $(`<th class="multr${i} selectable">${i}</th>`);
    th.hover(lin,lout);
    th.click(lclick);
    row.append(th);
    for(j=1; j<=12; j++) {
      var td = $(`<td class="${i===j?"diag":""} multr${i} multc${j}">${i*j}</td>`)
      td.hover(lin,lout);
      td.click(lclick);
      row.append(td);
    }
    table.append(row);
  }
  for(i=1; i<=5; i++) {
    tables[i].selected = true;
  }
  updateSelection();
});
