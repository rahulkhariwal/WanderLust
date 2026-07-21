const taxSwitch = document.getElementById("taxSwitch");

taxSwitch.addEventListener("change", () => {

    const basePrices = document.querySelectorAll(".base-price");
    const taxPrices = document.querySelectorAll(".tax-price");

    if (taxSwitch.checked) {

        basePrices.forEach(price => price.classList.add("d-none"));
        taxPrices.forEach(price => price.classList.remove("d-none"));

    } else {

        basePrices.forEach(price => price.classList.remove("d-none"));
        taxPrices.forEach(price => price.classList.add("d-none"));

    }

});