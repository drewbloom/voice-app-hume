import "server-only";
import updateConfig from '@/utils/updateConfig';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { caseTitle } = req.body;
      console.log('Received caseTitle:', caseTitle); // Log the caseTitle
  
      try {
        const result = await updateConfig(caseTitle);
        console.log('Update result:', result); // Log the result from updateConfig
        res.status(200).json({ updatedConfigVersion: result });
        
      } catch (error) {
        console.error('Error in updateConfig:', error); // Ensure error details are logged
        res.status(500).json({ error: 'Error updating configuration' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }