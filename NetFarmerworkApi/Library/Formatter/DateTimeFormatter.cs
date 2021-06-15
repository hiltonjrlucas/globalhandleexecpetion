using System;

namespace Library.Formatter
{
    public class DateTimeFormatter
    {
        public static string DisplayTime(double totalHours, bool showSeconds = true)
        {
            var time = TimeSpan.FromHours(totalHours);
            var display = $"{time}";

            // definição das horas no formato: hh | -hh
            if (time.Days < 0 || time.Days > 0)
            {
                var partTime = new string[3];
                var hours = (Convert.ToInt32(time.Days) * 24) + time.Hours;
                partTime[0] = $"{hours}";

                // definição dos minutos no formato: mm
                if (time.Minutes > -10 && time.Minutes < 10)
                {
                    partTime[1] = (time.Minutes < 0) ? $"0{time.Minutes * -1}" : $"0{time.Minutes}";
                }
                else
                {
                    partTime[1] = (time.Minutes < 0) ? $"{ time.Minutes * -1 }" : $"{time.Minutes}";
                }

                // definição dos segundos no formato: ss
                if (time.Seconds > -10 && time.Seconds < 10)
                {
                    partTime[2] = (time.Seconds < 0) ? $"0{time.Seconds * -1}" : $"0{time.Seconds}";
                }
                else
                {
                    partTime[2] = (time.Seconds < 0) ? $"{ time.Seconds * -1 }" : $"{time.Seconds}";
                }

                display = string.Join(":", partTime);
            }

            if (!showSeconds)
            {
                display = display.Substring(0, display.Length - 3);
            }

            return display;
        }
    }
}
