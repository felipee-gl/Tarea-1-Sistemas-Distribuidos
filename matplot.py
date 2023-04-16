import matplotlib.pyplot as plt 

with open('C:/Users/felip/Desktop/src/times.txt', 'r') as File:
    archivo = File.read()
    datos = [float(dato) for dato in archivo.split()]


plt.plot(datos)

plt.ylabel('Tiempo')
plt.xlabel('Consultas')
plt.title('Gráfico ResponseTime')
plt.show()