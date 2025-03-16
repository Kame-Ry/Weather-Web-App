emailjs.init('HSwpVqrwZkX8zURpF');

document.addEventListener('DOMContentLoaded', () => {
  loadContactFormComponent().then(initContactForm);
});

function loadContactFormComponent() {
  return fetch('/components/contact_form.html')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.text();
    })
    .then(html => {
      document.getElementById('contact').innerHTML = html;
      
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.render(document.querySelector('.g-recaptcha'), {
          sitekey: '6LfAKvAqAAAAAAF4DCtmoBf_3Pv0yc9_geygvNkk'
        });
      }
      
      setupInputValidation();
    })
    .catch(err => {
      console.error('Fetch error:', err);
      document.getElementById('contact').innerHTML =
        "<p>Error loading form. Please try again later.</p>";
    });
}

function setupInputValidation() {
  const messageField = document.getElementById('message');
  const nameField = document.getElementById('user_name');

  const maxLength = 200;
  const regex = /^[a-zA-Z0-9\s.,!?'-]{1,200}$/;

  messageField.addEventListener('input', () => {
    const statusDiv = document.getElementById('form-status');

    if (messageField.value.length > maxLength) {
      statusDiv.textContent = `Message too long! Max ${maxLength} characters.`;
      statusDiv.style.color = 'red';
    } else if (!regex.test(messageField.value)) {
      statusDiv.textContent = 'Invalid characters used!';
      statusDiv.style.color = 'red';
    } else {
      statusDiv.textContent = '';
    }
  });

  nameField.addEventListener('input', () => {
    if (!regex.test(nameField.value)) {
      nameField.setCustomValidity("Invalid characters used!");
    } else {
      nameField.setCustomValidity("");
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (typeof grecaptcha === 'undefined') {
      statusDiv.textContent = 'reCAPTCHA is not loaded yet. Please wait.';
      statusDiv.style.color = 'red';
      return;
    }

    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      statusDiv.textContent = 'Please complete the reCAPTCHA!';
      statusDiv.style.color = 'red';
      return;
    }

    const userName = document.getElementById('user_name').value.trim();
    const userEmail = document.getElementById('user_email').value.trim();
    const message = document.getElementById('message').value.trim();

    const regex = /^[a-zA-Z0-9\s.,!?'-]{1,200}$/;
    if (!regex.test(userName) || !regex.test(message)) {
      statusDiv.textContent = 'Invalid input detected!';
      statusDiv.style.color = 'red';
      return;
    }

    const formData = {
      user_name: userName,
      user_email: userEmail,
      message: message,
      'g-recaptcha-response': recaptchaResponse,
    };

    statusDiv.textContent = 'Sending...';
    statusDiv.style.color = '#000';

    emailjs.send('gmail_service', 'contact_form', formData)
      .then(() => {
        statusDiv.textContent =
          'Message sent successfully! We will get back to you shortly.';
        statusDiv.style.color = 'green';
        form.reset();
        grecaptcha.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        statusDiv.textContent = 'Error sending message. Please try again.';
        statusDiv.style.color = 'red';
        grecaptcha.reset();
      });
  });
}
