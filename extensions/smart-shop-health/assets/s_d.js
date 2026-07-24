(function () {
  fetch("/apps/shophealth/score")
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Request Failed" + res.status);
      }
      return res.json()
    })
    .then(function (data) {
      var scoreVal = document.getElementById("health_score");
      var lastScanVal = document.getElementById("last_scanned");

      if (data == null) {
        scoreVal.textContent = "No Scan Has Been Performed";
        lastScanVal.textContent = "";
        return;
      }

      scoreVal.textContent = "Store Health: " + data.score;
      if (data.lastScanDate) {
        var d = new Date(data.lastScanDate);
        lastScanVal.textContent =
          "Last scan: " +
          d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
      }
    })
    .catch(function (err) {
      document.getElementById("health_score").textContent = 'Unable to load score';
        console.error('ShopHealth widget error:', err);
      });
  })();

