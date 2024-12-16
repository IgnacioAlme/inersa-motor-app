import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 20,
  },
  wrapper: {
    border: '1 solid #333',
    padding: 5,
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  bold: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
  },
  largeText: {
    fontSize: 24,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '11%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    backgroundColor: '#ccc',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 8,
  },
});

const InvoicePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={[styles.wrapper, styles.centerText, styles.bold]}>
        <Text style={styles.header}>ORIGINAL</Text>
      </View>

      <View style={styles.flexRow}>
        <View style={[styles.wrapper, styles.column]}>
          <Text style={[styles.centerText, styles.largeText]}>INERSA MOTORSPORT</Text>
          <Text>Razón Social: Inersa Motorsport S.A.</Text>
          <Text>Domicilio Comercial: Calle Principal 123, Ciudad</Text>
          <Text>Condición frente al IVA: Responsable Inscripto</Text>
        </View>
        <View style={[styles.wrapper, styles.column]}>
          <Text style={[styles.centerText, styles.largeText]}>FACTURA</Text>
          <Text>Punto de Venta: 00001 Comp. Nro: {data.revisionId}</Text>
          <Text>Fecha de Emisión: {data.fecha}</Text>
          <Text>CUIT: 30-12345678-9</Text>
          <Text>Ingresos Brutos: 123-456789-0</Text>
          <Text>Fecha de Inicio de Actividades: 01/01/2020</Text>
        </View>
      </View>

      <View style={[styles.wrapper, styles.flexRow]}>
        <Text>Período Facturado Desde: {data.fecha}</Text>
        <Text>Hasta: {data.fecha}</Text>
        <Text>Fecha de Vto. para el pago: {data.fecha}</Text>
      </View>

      <View style={styles.wrapper}>
        <Text><Text style={styles.bold}>DNI:</Text> {data.cliente.dni || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Apellido y Nombre / Razón Social:</Text> {data.cliente.nombre} {data.cliente.apellido}</Text>
        <Text><Text style={styles.bold}>Condición frente al IVA:</Text> Consumidor Final</Text>
        <Text><Text style={styles.bold}>Domicilio:</Text> {data.cliente.direccion || 'N/A'}</Text>
        <Text><Text style={styles.bold}>Condición de venta:</Text> Contado</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>Código</Text></View>
          <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>Producto / Servicio</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Cantidad</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>U. Medida</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Precio Unit.</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>% Bonif</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>Subtotal</Text></View>
        </View>
        {data.repuestos.map((repuesto, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{repuesto.codigo}</Text></View>
            <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{repuesto.descripcion}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>1</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>unidad</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{repuesto.precio}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>0,00</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{repuesto.precio}</Text></View>
          </View>
        ))}
      </View>

      <View style={[styles.flexRow, { marginTop: 20 }]}>
        <View style={[styles.wrapper, { width: '60%' }]}>
          <Text style={styles.bold}>Otros tributos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>Descripción</Text></View>
              <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>Alíc. %</Text></View>
              <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>Importe</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>Impuestos Municipales</Text></View>
              <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>-</Text></View>
              <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>0,00</Text></View>
            </View>
          </View>
        </View>
        <View style={[styles.wrapper, { width: '35%' }]}>
          <Text><Text style={styles.bold}>Importe Neto Gravado: $</Text> {data.totalPresupuesto}</Text>
          <Text><Text style={styles.bold}>IVA 21%: $</Text> {(data.totalPresupuesto * 0.21).toFixed(2)}</Text>
          <Text><Text style={styles.bold}>Importe Otros Tributos: $</Text> 0,00</Text>
          <Text><Text style={styles.bold}>Importe Total: $</Text> {(data.totalPresupuesto * 1.21).toFixed(2)}</Text>
        </View>
      </View>

      <View style={[styles.flexRow, { marginTop: 20 }]}>
        <View style={{ width: '20%' }}>
          {/* Add QR code image here */}
        </View>
        <View style={{ width: '40%' }}>
          <Text style={[styles.bold, { fontStyle: 'italic' }]}>Comprobante Autorizado</Text>
          <Text style={{ fontSize: 8, fontStyle: 'italic' }}>Esta Administración Federal no se responsabiliza por los datos ingresados en el detalle de la operación</Text>
        </View>
        <View style={{ width: '40%' }}>
          <Text><Text style={styles.bold}>CAE N°:</Text> 12345678901234</Text>
          <Text><Text style={styles.bold}>Fecha de Vto. de CAE:</Text> {data.fecha}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;