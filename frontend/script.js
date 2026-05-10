const BACKEND_URL = "https://simplerag-ljmv.onrender.com/";


async function uploadPDF() {

    const fileInput =
        document.getElementById("pdfFile");

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a PDF");
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch(
            `${BACKEND_URL}/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        document.getElementById("uploadedFile").innerText =
            `✅ Uploaded PDF: ${file.name}`;

        alert(data.message);
    }

    catch (error) {

        console.error(error);

        document.getElementById("uploadedFile").innerText =
            "❌ Upload failed";

        alert("Upload failed");
    }
}


async function askQuestion() {

    const question =
        document.getElementById("question").value;

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

        document.getElementById("answerBox").innerText =
            data.answer;
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