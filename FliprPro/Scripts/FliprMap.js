var map;
var markers = [];
var activeInfoWindow;

function initMap() {
    var francePos = { lat: 47.303075, lng: 2.526855 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: francePos,
        mapTypeId: 'roadmap',
        mapTypeControl: false
    });

    $.get(
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
                        $.get(
                            "https://api.goflipr.com/v1.1/cities/" + marker.ville.Id + "/pools",
                            function (data) {
                                let toto = dataCompliation(data);

                                var infoWindow = new google.maps.InfoWindow({
                                    content: "<div><h4>" + marker.ville.Name + " (" + marker.ville.ZipCode + ")<h4><br/>"

                                });

                                if (activeInfoWindow != undefined)
                                    activeInfoWindow.close();
                                infoWindow.open(map, marker);
                                activeInfoWindow = infoWindow;
                            },
                            "json"
                        );
                    });

                markers.push(marker);
            }

            var markerCluster = new MarkerClusterer(map, markers,
                { imagePath: "/Images/markerclusterer/m" });
        },
        "json"
    );
}

function dataCompliation(data) {

    let toto = new Object(); //TODO : trouver un meilleur nom

    let AnConstMoy = 0;

    toto.Coating = new Map();
    toto.Integration = new Map();
    toto.Shape = new Map();
    toto.Filtration = new Map();
    toto.Treatment = new Map();


    for (i = 0; i < data.length; i++) {
        AnConstMoy = (AnConstMoy + data[i].BuiltYear) / 2;

        let coatingNb = toto.Coating.get(data[i].Coating);
        if (coatingNb == undefined)
            toto.Coating.set(data[i].Coating, 1);
        else
            toto.Coating.set(data[i].Coating, coatingNb + 1);

        let IntegrationNb = toto.Integration.get(data[i].Integration); 
        if (IntegrationNb == undefined)
            toto.Integration.set(data[i].Integration, 1);
        else
            toto.Integration.set(data[i].Integration, IntegrationNb + 1);

        let ShapeNb = toto.Shape.get(data[i].Shape); 
        if (ShapeNb == undefined)
            toto.Shape.set(data[i].Shape, 1);
        else
            toto.Shape.set(data[i].Shape, ShapeNb + 1);

        let FiltrationNb = toto.Filtration.get(data[i].Filtration); 
        if (FiltrationNb == undefined)
            toto.Filtration.set(data[i].Filtration, 1);
        else
            toto.Filtration.set(data[i].Filtration, FiltrationNb + 1);

        let TreatmentNb = toto.Treatment.get(data[i].Treatment); 
        if (TreatmentNb == undefined)
            toto.Treatment.set(data[i].Treatment, 1);
        else
            toto.Treatment.set(data[i].Treatment, TreatmentNb + 1);

    }

    toto.age = new Date().getFullYear - AnConstMoy;

    return toto;
}