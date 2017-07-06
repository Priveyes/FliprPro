var map;
var markers = [];
var activeInfoWindow;

function initMap() {
    var francePos = { lat: 47.303075, lng: 2.526855 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: francePos,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        mapTypeControl: false
    });

    $.getJSON(
        "https://api.goflipr.com/v1.1/cities",
        function (data) {
            for (var i = 0; i < data.length; i++) {
                let marker = new google.maps.Marker({
                    position: { lat: data[i].Latitude, lng: data[i].Longitude },
                    map: map,
                    title: data[i].Name
                });

                marker.ville = data[i];

                marker.addListener('click',
                    function () {
                        $.getJSON(
                            "https://api.goflipr.com/v1.1/cities/" + marker.ville.Id + "/pools",
                            function (json) {
                                let html = makeInfoWindowHtml(dataCompliation(json), marker);

                                var infoWindow = new google.maps.InfoWindow({
                                    content: html
                                });

                                if (activeInfoWindow != undefined)
                                    activeInfoWindow.close();
                                infoWindow.open(map, marker);
                                activeInfoWindow = infoWindow;
                            }
                        );
                    });

                markers.push(marker);
            }

            google.maps.event.addListener(map, 'bounds_changed', function () {
                bounds = map.getBounds();
                let array = [];
                for (let i = 0; i < markers.length; i++) {
                    if (map.getBounds().contains(markers[i].getPosition())) {
                    }
                }
            });

            var markerCluster = new MarkerClusterer(map, markers,
                { imagePath: "/Images/markerclusterer/m" });
        }
    );
}



function dataCompliation(json) {
    let data = new Object();

    let ageSum = 0;
    data.Coating = new Map();
    data.Integration = new Map();
    data.Shape = new Map();
    data.Filtration = new Map();
    data.Treatment = new Map();
    data.NbSwPool = json.length;

    let test = json[0].Coating === json[0].Coating;

    for (i = 0; i < json.length; i++) {
        ageSum += new Date().getFullYear() - json[i].BuiltYear;

        let coatingNb = data.Coating.get(json[i].Coating.Name);
        if (coatingNb == undefined)
            data.Coating.set(json[i].Coating.Name, 1);
        else
            data.Coating.set(json[i].Coating.Name, coatingNb + 1);

        let IntegrationNb = data.Integration.get(json[i].Integration.Name);
        if (IntegrationNb == undefined)
            data.Integration.set(json[i].Integration.Name, 1);
        else
            data.Integration.set(json[i].Integration.Name, IntegrationNb + 1);

        let ShapeNb = data.Shape.get(json[i].Shape.Name);
        if (ShapeNb == undefined)
            data.Shape.set(json[i].Shape.Name, 1);
        else
            data.Shape.set(json[i].Shape.Name, ShapeNb + 1);

        let FiltrationNb = data.Filtration.get(json[i].Filtration.Name);
        if (FiltrationNb == undefined)
            data.Filtration.set(json[i].Filtration.Name, 1);
        else
            data.Filtration.set(json[i].Filtration.Name, FiltrationNb + 1);

        let TreatmentNb = data.Treatment.get(json[i].Treatment.Name);
        if (TreatmentNb == undefined)
            data.Treatment.set(json[i].Treatment.Name, 1);
        else
            data.Treatment.set(json[i].Treatment.Name, TreatmentNb + 1);

    }

    data.age = Math.round(ageSum / json.length);

    return data;
}

function makeInfoWindowHtml(data, marker) {
    let html = "<h4>" + marker.ville.Name + " (" + marker.ville.ZipCode + ")</h4><br/>";

    html += "<p>Moyenne d'age des piscines : " + data.age + " ans</p>";
    html += "<p>Nombre de piscine : " + data.NbSwPool + "</p>";

    html += "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>";

    //Integration
    html += "<div class='panel panel-primary'><div class='panel-heading' role='tab' id='Heading-IntegrPan'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#Collapse-IntegrPan' aria-expanded='true' aria-controls='Collapse-IntegrPan'>Type de piscines</a></h4></div><div id='Collapse-IntegrPan' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='Heading-IntegrPan'>";
    html += "<table table-bordered class='table table-bordered table table-bordered-bordered'><tr><th>Type de piscine</th><th>Nombre</th></tr>";
    for (let [type, number] of data.Integration) {
        html += "<tr><td>" + type + "</td><td>" + number + "</td></tr>";
    }
    html += "</table></div></div>";

    //Shape
    html += "<div class='panel panel-primary'><div class='panel-heading' role='tab' id='Heading-ShapePan'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#Collapse-ShapePan' aria-expanded='true' aria-controls='Collapse-ShapePan'>Formes</a></h4></div><div id='Collapse-ShapePan' class='panel-collapse collapse' role='tabpanel' aria-labelledby='Heading-ShapePan'>";
    html += "<table table-bordered class='table table-bordered'><tr><th>Forme des piscines</th><th>Nombre</th></tr>";
    for (let [type, number] of data.Shape) {
        html += "<tr><td>" + type + "</td><td>" + number + "</td></tr>";
    }
    html += "</table></div></div>";

    //Coating
    html += "<div class='panel panel-primary'><div class='panel-heading' role='tab' id='Heading-CoatingPan'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#Collapse-CoatingPan' aria-expanded='true' aria-controls='Collapse-CoatingPan'>Surfaces</a></h4></div><div id='Collapse-CoatingPan' class='panel-collapse collapse' role='tabpanel' aria-labelledby='Heading-CoatingPan'>";
    html += "</table><table table-bordered class='table table-bordered'><tr><th>Type de surface</th><th>Nombre</th></tr>";
    for (let [type, number] of data.Coating) {
        html += "<tr><td>" + type + "</td><td>" + number + "</td></tr>";
    }
    html += "</table></div></div>";

    //Filtration
    html += "<div class='panel panel-primary'><div class='panel-heading' role='tab' id='Heading-FiltrationPan'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#Collapse-FiltrationPan' aria-expanded='true' aria-controls='Collapse-FiltrationPan'>Filtrations</a></h4></div><div id='Collapse-FiltrationPan' class='panel-collapse collapse' role='tabpanel' aria-labelledby='Heading-FiltrationPan'>";
    html += "</table><table table-bordered class='table table-bordered'><tr><th>Type de filtration</th><th>Nombre</th></tr>"
    for (let [type, number] of data.Filtration) {
        html += "<tr><td>" + type + "</td><td>" + number + "</td></tr>";
    }
    html += "</table></div></div>";

    //Treatment
    html += "<div class='panel panel-primary'><div class='panel-heading' role='tab' id='Heading-TreatmentPan'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#Collapse-TreatmentPan' aria-expanded='true' aria-controls='Collapse-TreatmentPan'>Traitements</a></h4></div><div id='Collapse-TreatmentPan' class='panel-collapse collapse' role='tabpanel' aria-labelledby='Heading-TreatmentPan'>";
    html += "</table><table table-bordered class='table table-bordered'><tr><th>Type de traitement</th><th>Nombre</th></tr>";
    for (let [type, number] of data.Treatment) {
        html += "<tr><td>" + type + "</td><td>" + number + "</td></tr>";
    }

    html += "</table></div></div></div>";

    return html;
}