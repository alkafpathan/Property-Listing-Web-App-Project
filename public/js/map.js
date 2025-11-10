let mapKey = mapToken;


              console.log(mapKey)
              maptilersdk.config.apiKey = mapKey;
              const map = new maptilersdk.Map({
                container: 'map', // container's id or the HTML element to render the map
                style: maptilersdk.MapStyle.STREETS,
                center : listing.geometry.coordinates , //starting [lng , lat]
                zoom : 10,
              });



              const marker = new maptilersdk.Marker({ color: "red" })
              .setLngLat(listing.geometry.coordinates)//listing.geometry.cooridinates
              .setPopup(
                new maptilersdk.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
              )
              .addTo(map);