using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;

namespace VicPortalRH.Services
{
    public class ExcelService<T>
    {
        private ExcelPackage _package { get; set; }

        private int _row { get; set; }
        private int _column { get; set; }

        private ExcelRange _cell { get; set; }

        public ExcelService()
        {
            _package = new ExcelPackage(new FileInfo(@"\template.xlsx"));
            _package.Workbook.Properties.Author = "vic-portal-rh";

            _row = 1;
            _column = 1;
        }

        public byte[] Build()
        {
            return _package.GetAsByteArray();
        }

        public void AddWorkSheet(string title, string sheetName, List<T> data)
        {
            ExcelWorksheet sheet = GetSheet(sheetName);
            var list = data.Select((item, i) => new { item, i }).ToList();
            var columnBase = list.First().item.GetType().GetProperties();

            AddTitle(sheet, title, columnBase.Length);

            //Colunas
            columnBase.ToList().ForEach(property =>
            {
                _cell = sheet.Cells[_row, _column];

                _cell.Value = property.Name;
                _cell.Style.Font.Bold = true;
                _cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                _cell.Style.Fill.BackgroundColor.SetColor(Color.LightGray);

                _column++;
            });
            
            _column = 1;
            _row += 1;

            //Linhas
            list.ForEach(obj =>
            {
                obj.item.GetType().GetProperties().ToList().ForEach(property =>
                {
                    _cell = sheet.Cells[_row, _column];
                    _cell.Value = property.GetValue(obj.item).ToString();
                    _column++;
                });

                _row++;
                _column = 1;
            });

            _row += 2;

            sheet.Cells[sheet.Dimension.Address].AutoFitColumns();
        }

        public void AddTitle(ExcelWorksheet sheet, string title, int sizeTitle)
        {
            sheet.Cells[_row, 1].Value = title;
            sheet.Cells[_row, 1, _row, sizeTitle].Merge = true;
            sheet.Cells[_row, 1, _row, sizeTitle].Style.Font.Bold = true;
            sheet.Cells[_row, 1, _row, sizeTitle].Style.Font.Color.SetColor(Color.White);
            sheet.Cells[_row, 1, _row, sizeTitle].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            sheet.Cells[_row, 1, _row, sizeTitle].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[_row, 1, _row, sizeTitle].Style.Fill.BackgroundColor.SetColor(Color.Gray);

            _row++;
        }

        public ExcelWorksheet GetSheet(string sheetName)
        {
            ExcelWorksheet sheet = _package.Workbook.Worksheets.Where(w => w.Name == sheetName).FirstOrDefault();
            if (sheet == null)
            {
                sheet = _package.Workbook.Worksheets.Add(sheetName);
                _row = 1;
                _column = 1;
            }

            return sheet;
        }
    }
}
