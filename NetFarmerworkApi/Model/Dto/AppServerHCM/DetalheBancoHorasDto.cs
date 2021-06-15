using System.Collections.Generic;

namespace Model.Dto.AppServerHCM
{
    public class DetalheBancoHorasDto
    {
        public bool authenticated { get; set; }
        public string error { get; set; }
        public IEnumerable<BancoHorasItemDto> items { get; set; }
    }
}
