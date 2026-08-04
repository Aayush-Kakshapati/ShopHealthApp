(function () {
  function formatScanDate(lastScanDate) {
    return lastScanDate
      ? new Date(lastScanDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No Date";
  }

  function renderIssuesList(issues) {
    if (!issues || issues.length === 0) {
      return "<p>No issues found</p>";
    }

    var items = issues
      .map(function (issue) {
        if (typeof issue === "string") {
          return "<li>" + issue + "</li>";
        }
        var label = issue.label || issue.title || issue.message || "Issue";
        var severity = issue.severity ? " (" + issue.severity + ")" : "";
        return "<li>" + label + severity + "</li>";
      })
      .join("");

    return "<h4>Issues</h4><ul>" + items + "</ul>";
  }

  function openModal(data, scanDate) {
    var existingModal = document.querySelector(".issue_display_modal");
    if (existingModal) existingModal.remove();

    var modalContainer = document.createElement("div");
    modalContainer.className = "issue_display_modal";

    modalContainer.innerHTML =
      '<div class="issue_modal_box">' +
      "<h3>Store Health Details</h3>" +
      "<p>Health Score: " + data.score + "</p>" +
      "<p>Last Scan: " + scanDate + "</p>" +
      renderIssuesList(data.issues) +
      '<button class="close_modal">Close</button>' +
      "</div>";

    document.body.appendChild(modalContainer);

    modalContainer
      .querySelector(".close_modal")
      .addEventListener("click", function () {
        modalContainer.remove();
      });

    // Click on the dark backdrop (not the box itself) also closes the modal
    modalContainer.addEventListener("click", function (e) {
      if (e.target === modalContainer) {
        modalContainer.remove();
      }
    });
  }

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
        healthTracker.innerHTML = '<div class="scoreDateBox">No Scan</div>';
        return;
      }

      var scanDate = formatScanDate(data.lastScanDate);

      healthTracker.innerHTML =
        '<div class="scoreDateBox">Store Health ' + data.score + "</div>";

      healthTracker.addEventListener("click", function () {
        openModal(data, scanDate);
      });
    })
    .catch(function (err) {
      console.error("ShopHealth widget error:", err);
    });
})();