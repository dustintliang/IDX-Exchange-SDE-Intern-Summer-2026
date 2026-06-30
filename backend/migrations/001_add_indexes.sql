-- Indexes for filtered columns on rets_property
-- Run with: SET sql_mode=''; before executing if the table has legacy defaults

CREATE INDEX idx_price      ON rets_property (L_SystemPrice);
CREATE INDEX idx_beds       ON rets_property (L_Keyword2);
CREATE INDEX idx_baths      ON rets_property (LM_Dec_3);

-- Composite index for the common city+price combined filter
CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);
