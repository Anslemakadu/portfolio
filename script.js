"use strict";

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const buttonText = submitButton.querySelector(".button-text");
  const formStatus = document.querySelector("#form-status");

  const updateFormStatus = (message, state = "") => {
    formStatus.textContent = message;

    if (state) {
      formStatus.dataset.state = state;
    } else {
      delete formStatus.dataset.state;
    }
  };

  const setSubmitting = (isSubmitting) => {
    submitButton.disabled = isSubmitting;
    contactForm.setAttribute("aria-busy", String(isSubmitting));
    buttonText.textContent = isSubmitting ? "Sending…" : "Send message";
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitButton.disabled) {
      return;
    }

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    setSubmitting(true);
    updateFormStatus("Sending your message…");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Form service returned ${response.status}`);
      }

      contactForm.reset();
      updateFormStatus("Thanks, your message was sent.");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      updateFormStatus(
        "Unable to send your message right now. Please email me directly.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  });
}
