require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
], (Map, SceneView, FeatureLayer, Graphic, GraphicsLayer, BasemapGallery, Expand, Legend) => {


    const map1 = new Map({
        basemap: "topo-vector"
    });

    const view = new SceneView({
        map: map1,
        container: "mapDiv",
        center:[-100.4593, 36.9014],
        zoom: 5
    });

    // Warstwy
    const gl = new GraphicsLayer();

    const fl = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    map1.add(fl);
    map1.add(gl);

    // Grafiki

    // const geom = {
    //     type: "polyline",
    //     paths: [[-96.06326,33.759],[-97.06298,32.755]]
    // };

    // const sym = {
    //     type:"simple-line",
    //     color: "blue",
    //     width: 2,
    //     style: "dash"
    // };

    // const attr = {
    //     country: "Polska",
    //     code: "POL"
    // };

    // const popTmpl = {
    //     title: "Obiekt Web-GIS",
    //     content: "Zaznaczony obiekt pochodzi z kraju {country}"
    // }

    // const graph = new Graphic({
    //     geometry: geom,
    //     symbol: sym,
    //     attributes: attr,
    //     popupTemplate: popTmpl
    // });

    // gl.add(graph);

    // Widgety

    const bmWg = new BasemapGallery({
        view: view
    });

    const expandWg = new Expand({
        view: view,
        content: bmWg
    });

    view.ui.add(expandWg, {
        position: "top-right"
    });

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, {position: "bottom-right"});

    let query = fl.createQuery();
    query.where = "MAGNITUDE > 4";
    query.outField = ["*"];
    query.returnGeometry = true;

    fl.queryFeatures(query)
    .then(response => {
        console.log(response);
        getResults(response.features);
    })
    .catch(err => {
        console.log(err);
    });

    // const getResults = (features) => {
    //     const symbol = {
    //         type: "simple-marker",
    //         size: 6,
    //         color: "red",
    //         style: "square"
    //     };
    // features.map(elem => {
    //     elem.symbol = symbol;
    // });
    // gl.addMany(features);
    // };

    // rendery

    const simple = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width: 5000
                }
            ],
            size: 6,
            color: "red",
            style: "square"
        },
        label: "Earthquakes",
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    },
                    
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3,
                        size: 5000
                    },
                    {
                        value: 31,
                        size: 150000
                    }
                ]
            }
        ]
    };

    fl.renderer = simple;
});

[
    {
        "statisticType": "min",
        "onStatisticField": "MAGNITUDE",
    },
    {
        "statisticType": "avg",
        "onStatisticField": "MAGNITUDE",
    },
    {
        "statisticType": "max",
        "onStatisticField": "MAGNITUDE",
    }
]