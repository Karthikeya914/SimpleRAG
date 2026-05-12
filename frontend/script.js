const BACKEND_URL = "https://simplerag-ljmv.onrender.com";


async function uploadPDF() {

    const fileInput =
        document.getElementById("pdfFile");

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a PDF");
        return;
    }

    const progressContainer =
        document.getElementById("progressContainer");

    const progressBar =
        document.getElementById("progressBar");

    progressContainer.classList.remove("hidden");

    progressBar.style.width = "100%";
    progressBar.innerText = "Uploading PDF...";

    const formData = new FormData();

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open(
        "POST",
        `${BACKEND_URL}/upload`
    );

    xhr.upload.onprogress = function(event) {

        if (event.lengthComputable) {

            const percent = Math.round(
                (event.loaded / event.total) * 100
            );

            progressBar.style.width = `${percent}%`;

            progressBar.innerText = `${percent}%`;
        }
    };

    xhr.onload = function() {

        if (xhr.status === 200) {

            document.getElementById("uploadedFile").innerHTML =
                `
                ✅ Uploaded PDF: ${file.name}
                <button onclick="deletePDF()" class="delete-btn">
                    Delete
                </button>
                `;

            progressBar.innerText = "Upload Complete";

            setTimeout(() => {
                progressContainer.classList.add("hidden");
            }, 1000);
        }

        else {

            document.getElementById("uploadedFile").innerText =
                "❌ Upload failed";

            progressContainer.classList.add("hidden");

            alert("Upload failed");
        }
    };

    xhr.onerror = function() {

        document.getElementById("uploadedFile").innerText =
            "❌ Upload failed";

        progressContainer.classList.add("hidden");

        alert("Upload failed");
    };

    xhr.send(formData);
}


async function askQuestion() {

    const question =
        document.getElementById("question").value;

    document.getElementById("question").value = "";

    if (!question) {
        alert("Please enter a question");
        return;
    }

    const loader = document.getElementById("loader");

    loader.classList.remove("hidden");

    document.getElementById("answerBox").innerText =
        "";

    try {

        const response = await fetch(
            `${BACKEND_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    query: question
                })
            }
        );

        const data = await response.json();

        if (data.answer) {

            document.getElementById("answerBox").innerText =
                data.answer;
        }

        else if (data.detail) {

            document.getElementById("answerBox").innerText =
                data.detail;
        }

        else {

            document.getElementById("answerBox").innerText =
                "Something went wrong.";
        }
    }

    catch (error) {

        console.error(error);

        document.getElementById("answerBox").innerText =
            "Something went wrong.";
    }

    finally {

        loader.classList.add("hidden");
    }
}

function deletePDF() {

    document.getElementById("uploadedFile").innerText =
        "No PDF uploaded yet";

    document.getElementById("pdfFile").value = "";
}