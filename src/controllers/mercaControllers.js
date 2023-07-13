import mercadopago from "mercadopago";
const { get } = mercadopago.preferences;
import axios from "axios";
mercadopago.configure({
  // TOKEN DE VENDEDOR(FESSIA EN ESTE CASO)
  access_token: 'TEST-8819237090040703-071310-2e7a98e82272016528f93a304e3dd8e2-441902247'
});

export const crearOrden = async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'prueba',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: 1.5
        }
      ],
      //AYUDA A RETORNAR PRIMERO DATOS DE MP
      notification_url: 'https://9a72-24-232-158-33.ngrok-free.app/notificacion'
    };

    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;

    const preferenceDetails = await mercadopago.preferences.get(preferenceId);

    const initPoint = preferenceDetails.body.sandbox_init_point;
    //RETORNA URL PARA LA PESTAÑA DE PAGO DE MP
    res.json(initPoint);

    //res.json(preferenceDetails.body);
    //window.open(initPoint, '_blank');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

export const notificarOrden = async (req, res) => {
    const datos = req.body;
   //RETORNA DATOS DEL PRIMER POST COMO EL ID DE LA TRANSACCION
    if (datos.data && datos.data.id) {
      const id = datos.data.id;
      //ID TRANSACCION
      console.log(id);
      try {
        //GET A API DE MERCADO PAGO Q ME RETORNA ENTRE OTRAS COSAS EL ESTADO DE LA TRANSACCION
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            //TOKEN DEL VENDEDOR PARA QUE ME DEJE ACCEDER A LA API
          headers: {
            Authorization: `Bearer ${mercadopago.configurations.getAccessToken()}`
          }
        });
  
        const paymentDetails = response.data;
        const status = paymentDetails.status;
        //RETORNO EL STATUS DE LA TRANSACCION
        console.log(status);
  
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los detalles del pago' });
      }
    } else {
      console.log('No se encontró la propiedad "id" en "datos.data"');
      res.sendStatus(400);
    }
  };
