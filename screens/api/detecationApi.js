// detectionApi.js
export async function analyzeImages(images) {
    const formData = new FormData();
    images.forEach((img, idx) => {
      formData.append('image_files', {
        uri: img,
        type: 'image/jpeg',
        name: `image_${idx}.jpg`,
      });
    });
  
    try {
      const response = await fetch('http://YOUR_SERVER_IP:5000/analyze', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        return await response.json(); // e.g. { average_fake_probability, is_fake }
      } else {
        console.error('Server error:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error calling API:', error);
      return null;
    }
  }
  