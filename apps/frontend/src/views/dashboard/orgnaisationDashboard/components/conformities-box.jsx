import Box from "../../shared/dashboardComponents/Box";

// TODO: I will emove this after the API is implemented
const defaultStats = [{ "ISO 27001": 25 }, { "ISO 9001": 15 }, { DSPT: 45 }];

const ConformitiesBox = ({ stats = defaultStats }) => {
  // Flatten stats to [{label, value}]
  const data = (stats || []).map((obj) => {
    const key = Object.keys(obj)[0];
    return { label: key, value: obj[key] };
  });

  return (
    <Box className="conformities-box position-relative h-100 border-0">
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-4">
            <h4>Conformities</h4>
          </div>
        </div>

        <div className="conformity-bars d-flex align-items-center gap-3 flex-nowrap overflow-x-auto no-scrollbar h-100">
          {data.map((item, index) => {
            const isFirst = index === 0;
            // Height as percentage of 100, cap value at 100
            const cappedValue = Math.min(item.value, 100);
            const barHeight = `${(cappedValue / 100) * 100}%`;
            const labelTextClass = "text-muted";
            const barWrapperClass = isFirst
              ? "bar-wrapper bar-wrapper-main"
              : "bar-wrapper";

            return (
              <div
                key={item.label}
                className={`${barWrapperClass} d-flex align-items-end h-100 position-relative`}
              >
                <p className={`bar-title position-absolute ${labelTextClass}`}>
                  {item.label}
                </p>
                <div
                  className="bar-inner d-flex align-items-end justify-content-center"
                  style={{ height: barHeight }}
                >
                  <p className="bar-label">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
};

export default ConformitiesBox;
