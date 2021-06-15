using System;
using System.Reflection;

namespace VicPortalRH.Services
{
    public class VersionService
    {
        public string GetVersion()
        {
            Version version = Assembly.GetExecutingAssembly().GetName().Version;
            DateTime buildDate = new DateTime(2000, 1, 1)
                                    .AddDays(version.Build).AddSeconds(version.Revision * 2);

            return buildDate.ToString("yyyyMMdd.HHmm");
        }
    }
}
