SELECT 
    strftime('%m', fecha) AS month,
    SUM(presupuesto) AS total_revenue
FROM
    Revision
GROUP BY
    month
ORDER BY
    month;