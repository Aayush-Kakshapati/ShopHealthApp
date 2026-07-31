(function () {
  fetch("/apps/shophealth/score")
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Request Failed " + res.status);
      }
      return res.json();
    })
    .then(function (data) {
      var healthTracker = document.getElementById("healthTracker");

      if (!healthTracker) return;

      if (!data) {
        healthTracker.innerHTML = `
          <div class="scoreDateBox">
            No Scan
          </div>
        `;
        return;
      }

      var scanDate = data.lastScanDate
        ? new Date(data.lastScanDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No Date";

      healthTracker.innerHTML = `
        <div class="scoreDateBox">
          Store Health ${data.score}
        </div>
      `;

      healthTracker.addEventListener("click", function () {
        openModal(data);
      });

      function openModal(data) {
        var existingModal = document.querySelector(".issue_display_modal");

        if (existingModal) {
          existingModal.remove();
        }

        var modalContainer = document.createElement("div");
        modalContainer.className = "issue_display_modal";

        modalContainer.innerHTML = `
          <div class="issue_modal_box">
            <h3>Store Health Details</h3>

            <p>
              Health Score:
              ${data.score}
            </p>

            <p>
              Last Scan:
              ${scanDate}
            </p>

            ${
              data.issues
                ? `
                  <h4>Issues</h4>
                  <ul>
                    ${data.issues
                      .map(function (issue) {
                        return `<li>${issue}</li>`;
                      })
                      .join("")}
                  </ul>
                `
                : "<p>No issues found</p>"
            }

            <button class="close_modal">
              Close
            </button>
          </div>
        `;

        document.body.appendChild(modalContainer);

        modalContainer
          .querySelector(".close_modal")
          .addEventListener("click", function () {
            modalContainer.remove();
          });
      }
    })
    .catch(function (err) {
      console.error("ShopHealth widget error:", err);
    });
})();
